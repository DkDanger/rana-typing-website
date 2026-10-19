(() => {
  const acts = {
    bns: { titleKey: 'bnsTitle', files: { en: 'assets/acts/BNS-2023-english.pdf', hi: 'assets/acts/BNS-2023-hindi.pdf' } },
    bnss: { titleKey: 'bnssTitle', files: { en: 'assets/acts/BNSS-2023-english.pdf', hi: 'assets/acts/BNSS-2023-hindi.pdf' } },
    bsa: { titleKey: 'bsaTitle', files: { en: 'assets/acts/BSA-2023-english.pdf', hi: 'assets/acts/BSA-2023-hindi.pdf' } },
    ipc: { titleKey: 'ipcTitle', files: { en: 'assets/acts/IPC-1860-english.pdf', hi: 'assets/acts/IPC-1860-hindi.pdf' } }
  };
  const byId = id => document.getElementById(id);
  const panelIds = ['actReaderEmpty', 'actReaderLoading', 'actReaderError', 'actReaderOffline', 'actPdfReader'];
  const state = { act: null, language: document.documentElement.lang === 'hi' ? 'hi' : 'en', pdf: null, loadingTask: null, generation: 0, page: 1, pageCount: 0, zoom: 1, pageNodes: [], observer: null, renderTasks: new Map() };
  const pdfTextSearchCache = new WeakMap();
  const localFileMode = location.protocol === 'file:';
  let pdfjsPromise = null;
  let scrollFrame = 0;

  function showPanel(id) {
    for (const panelId of panelIds) byId(panelId).hidden = panelId !== id;
  }

  function fileFor(actId, language) {
    return acts[actId].files[language === 'hi' ? 'hi' : 'en'];
  }

  function setSelectedAct(actId) {
    document.querySelectorAll('[data-act]').forEach(button => {
      const selected = button.dataset.act === actId;
      if (selected) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    });
    const title = document.querySelector(`[data-act="${actId}"] .act-copy strong`);
    byId('actReaderTitle').textContent = title ? title.textContent : '';
    const file = fileFor(actId, state.language);
    byId('actPdfDownload').href = file;
    byId('actOpenPdf').href = file;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function capturePosition() {
    if (localFileMode || !state.pdf || state.pageNodes.length === 0) return { page: state.page || 1, fraction: 0 };
    updateCurrentPage();
    const pageNode = state.pageNodes[state.page - 1];
    if (!pageNode) return { page: state.page || 1, fraction: 0 };
    const viewRect = byId('actPdfViewport').getBoundingClientRect();
    const pageRect = pageNode.getBoundingClientRect();
    const fraction = clamp((viewRect.top + 8 - pageRect.top) / Math.max(1, pageRect.height), 0, 0.98);
    return { page: state.page, fraction };
  }

  async function ensurePdfJs() {
    if (!pdfjsPromise) {
      pdfjsPromise = import(new URL('assets/pdfjs/pdf.mjs', location.href).href).then(module => {
        module.GlobalWorkerOptions.workerSrc = new URL('assets/pdfjs/pdf.worker.mjs', location.href).href;
        return module;
      });
    }
    return pdfjsPromise;
  }

  async function disposeDocument() {
    if (state.observer) {
      state.observer.disconnect();
      state.observer = null;
    }
    for (const task of state.renderTasks.values()) {
      try { task.cancel(); } catch {}
    }
    state.renderTasks.clear();
    const pending = state.loadingTask;
    state.loadingTask = null;
    if (pending) {
      try { await pending.destroy(); } catch {}
    }
    const previous = state.pdf;
    state.pdf = null;
    if (previous) {
      try { await previous.destroy(); } catch {}
    }
  }

  function makePageNode(pageNumber, width, height) {
    const node = document.createElement('div');
    node.className = 'act-pdf-page';
    node.dataset.page = String(pageNumber);
    node.setAttribute('aria-label', `Page ${pageNumber}`);
    node.style.width = `${width}px`;
    node.style.height = `${height}px`;
    const loading = document.createElement('div');
    loading.className = 'act-pdf-page-loading';
    loading.setAttribute('aria-hidden', 'true');
    node.appendChild(loading);
    return node;
  }

  async function rebuildPageView(pdf, savedPosition, generation) {
    if (state.observer) state.observer.disconnect();
    state.observer = null;
    for (const task of state.renderTasks.values()) {
      try { task.cancel(); } catch {}
    }
    state.renderTasks.clear();
    const viewportElement = byId('actPdfViewport');
    const pagesElement = byId('actPdfPages');
    pagesElement.replaceChildren();
    state.pageNodes = [];

    const firstPage = await pdf.getPage(1);
    if (generation !== state.generation) return;
    const firstViewport = firstPage.getViewport({ scale: 1 });
    const availableWidth = Math.max(260, viewportElement.clientWidth - 34);
    const pageScale = (availableWidth / firstViewport.width) * state.zoom;
    const initialWidth = firstViewport.width * pageScale;
    const initialHeight = firstViewport.height * pageScale;
    const fragment = document.createDocumentFragment();
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const pageNode = makePageNode(pageNumber, initialWidth, initialHeight);
      state.pageNodes.push(pageNode);
      fragment.appendChild(pageNode);
    }
    pagesElement.appendChild(fragment);

    state.observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        const pageNumber = Number(entry.target.dataset.page);
        if (entry.isIntersecting) renderPage(pageNumber, generation);
        else if (Math.abs(pageNumber - state.page) > 4) releasePage(pageNumber);
      }
    }, { root: viewportElement, rootMargin: '900px 0px' });
    for (const pageNode of state.pageNodes) state.observer.observe(pageNode);

    byId('actPageTotal').textContent = String(pdf.numPages);
    byId('actPageInput').max = String(pdf.numPages);
    const progressPosition = Number.isFinite(savedPosition?.progress) ? clamp(savedPosition.progress, 0, 0.9999) * pdf.numPages : null;
    const restorePage = progressPosition === null ? clamp(Number(savedPosition?.page) || 1, 1, pdf.numPages) : clamp(Math.floor(progressPosition) + 1, 1, pdf.numPages);
    const restoreFraction = progressPosition === null ? (savedPosition?.fraction || 0) : progressPosition - (restorePage - 1);
    requestAnimationFrame(() => {
      if (generation !== state.generation) return;
      if (savedPosition) scrollToPage(restorePage, restoreFraction, false);
      else viewportElement.scrollTop = 0;
      updateCurrentPage();
      renderPage(restorePage, generation);
    });
  }

  async function renderPage(pageNumber, generation) {
    const node = state.pageNodes[pageNumber - 1];
    const pdf = state.pdf;
    if (!node || !pdf || generation !== state.generation || node.querySelector('canvas') || state.renderTasks.has(pageNumber)) return;
    try {
      const page = await pdf.getPage(pageNumber);
      if (generation !== state.generation || !node.isConnected) return;
      const naturalViewport = page.getViewport({ scale: 1 });
      const availableWidth = Math.max(260, byId('actPdfViewport').clientWidth - 34);
      const fitScale = (availableWidth / naturalViewport.width) * state.zoom;
      const viewport = page.getViewport({ scale: fitScale });
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const canvas = document.createElement('canvas');
      canvas.setAttribute('aria-label', `Page ${pageNumber}`);
      canvas.width = Math.floor(viewport.width * ratio);
      canvas.height = Math.floor(viewport.height * ratio);
      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;
      node.style.width = `${viewport.width}px`;
      node.style.height = `${viewport.height}px`;
      const context = canvas.getContext('2d', { alpha: false });
      node.replaceChildren(canvas);
      const task = page.render({ canvasContext: context, viewport, transform: ratio === 1 ? null : [ratio, 0, 0, ratio, 0, 0], background: '#ffffff' });
      state.renderTasks.set(pageNumber, task);
      await task.promise;
      if (generation !== state.generation) return;
    } catch (error) {
      if (error?.name !== 'RenderingCancelledException' && generation === state.generation && node.isConnected) {
        const note = document.createElement('div');
        note.className = 'act-pdf-error';
        note.textContent = `Page ${pageNumber} could not be rendered.`;
        node.replaceChildren(note);
      }
    } finally {
      state.renderTasks.delete(pageNumber);
    }
  }

  function releasePage(pageNumber) {
    const node = state.pageNodes[pageNumber - 1];
    if (!node || !node.querySelector('canvas')) return;
    const task = state.renderTasks.get(pageNumber);
    if (task) {
      try { task.cancel(); } catch {}
      state.renderTasks.delete(pageNumber);
    }
    const loading = document.createElement('div');
    loading.className = 'act-pdf-page-loading';
    loading.setAttribute('aria-hidden', 'true');
    node.replaceChildren(loading);
  }

  function updateCurrentPage() {
    if (!state.pageNodes.length) return;
    const top = byId('actPdfViewport').getBoundingClientRect().top + 4;
    let visiblePage = 1;
    for (const node of state.pageNodes) {
      if (node.getBoundingClientRect().bottom > top) {
        visiblePage = Number(node.dataset.page);
        break;
      }
    }
    state.page = visiblePage;
    byId('actPageInput').value = String(visiblePage);
    byId('actPagePrevious').disabled = visiblePage <= 1;
    byId('actPageNext').disabled = visiblePage >= state.pageCount;
  }

  function scrollToPage(pageNumber, fraction = 0, smooth = true) {
    if (!state.pageNodes.length) return;
    const page = clamp(Number(pageNumber) || 1, 1, state.pageCount);
    const node = state.pageNodes[page - 1];
    if (!node) return;
    const target = node.offsetTop + (node.offsetHeight * clamp(fraction, 0, 0.98)) - 4;
    if (smooth) byId('actPdfViewport').scrollTo({ top: Math.max(0, target), behavior: 'smooth' });
    else byId('actPdfViewport').scrollTop = Math.max(0, target);
    state.page = page;
    byId('actPageInput').value = String(page);
    renderPage(page, state.generation);
  }

  async function openAct(actId, language, savedPosition = null) {
    if (!acts[actId]) return;
    state.act = actId;
    state.language = language === 'hi' ? 'hi' : 'en';
    setSelectedAct(actId);
    const generation = ++state.generation;
    showPanel('actReaderLoading');

    if (localFileMode) {
      await disposeDocument();
      if (generation !== state.generation) return;
      setSelectedAct(actId);
      showPanel('actReaderOffline');
      return;
    }

    try {
      const pdfjsLib = await ensurePdfJs();
      if (generation !== state.generation) return;
      await disposeDocument();
      if (generation !== state.generation) return;
      const options = {
        url: new URL(fileFor(actId, state.language), location.href).href,
        cMapUrl: new URL('assets/pdfjs/cmaps/', location.href).href,
        cMapPacked: true,
        standardFontDataUrl: new URL('assets/pdfjs/standard_fonts/', location.href).href,
        wasmUrl: new URL('assets/pdfjs/wasm/', location.href).href,
        iccUrl: new URL('assets/pdfjs/iccs/', location.href).href
      };
      const task = pdfjsLib.getDocument(options);
      state.loadingTask = task;
      const pdf = await task.promise;
      if (generation !== state.generation) {
        await pdf.destroy();
        return;
      }
      state.loadingTask = null;
      state.pdf = pdf;
      state.pageCount = pdf.numPages;
      state.page = clamp(Number(savedPosition?.page) || 1, 1, pdf.numPages);
      showPanel('actPdfReader');
      await rebuildPageView(pdf, savedPosition, generation);
    } catch (error) {
      if (generation !== state.generation) return;
      console.error('Unable to open Act PDF:', error);
      await disposeDocument();
      showPanel('actReaderError');
    }
  }

  function selectAct(actId) {
    if (!acts[actId]) return;
    setSelectedAct(actId);
    if (localFileMode) {
      state.act = actId;
      state.language = document.documentElement.lang === 'hi' ? 'hi' : 'en';
      setSelectedAct(actId);
      showPanel('actReaderOffline');
    } else {
      openAct(actId, document.documentElement.lang, null);
    }
    byId('acts').scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (window.matchMedia('(max-width: 880px)').matches) {
      (localFileMode ? byId('actReaderOffline') : byId('actReaderLoading')).scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function setActReaderLanguage(language) {
    if (!state.act || (language !== 'en' && language !== 'hi') || language === state.language) return;
    const position = capturePosition();
    if (localFileMode) {
      state.language = language;
      setSelectedAct(state.act);
      return;
    }
    openAct(state.act, language, position);
  }

  document.querySelectorAll('[data-act]').forEach(button => button.addEventListener('click', () => selectAct(button.dataset.act)));
  byId('actPagePrevious').addEventListener('click', () => scrollToPage(state.page - 1));
  byId('actPageNext').addEventListener('click', () => scrollToPage(state.page + 1));
  byId('actPageInput').addEventListener('change', event => scrollToPage(event.currentTarget.value));
  byId('actPageInput').addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      scrollToPage(event.currentTarget.value);
      event.currentTarget.blur();
    }
  });
  byId('actZoomOut').addEventListener('click', () => changeZoom(-0.15));
  byId('actZoomIn').addEventListener('click', () => changeZoom(0.15));
  byId('actPdfViewport').addEventListener('scroll', () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = 0;
      updateCurrentPage();
    });
  }, { passive: true });

  function changeZoom(amount) {
    if (!state.pdf) return;
    const position = capturePosition();
    state.zoom = clamp(Math.round((state.zoom + amount) * 100) / 100, 0.7, 1.75);
    byId('actZoomValue').textContent = `${Math.round(state.zoom * 100)}%`;
    rebuildPageView(state.pdf, position, state.generation);
  }

  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    if (!state.pdf) return;
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      const position = capturePosition();
      rebuildPageView(state.pdf, position, state.generation);
    }, 180);
  });

  window.searchCurrentActPdf = async (query, onProgress = () => {}) => {
    if (!state.pdf) return { available: false, localFileMode };
    const pdf = state.pdf;
    const generation = state.generation;
    const clean = value => String(value || '').normalize('NFC').toLocaleLowerCase().replace(/\s+/g, ' ').trim();
    const wanted = clean(query);
    const compactWanted = wanted.replace(/\s/g, '');
    if (!wanted) return { available: true, results: [], searchable: true };
    let cache = pdfTextSearchCache.get(pdf);
    if (!cache) { cache = new Map(); pdfTextSearchCache.set(pdf, cache); }
    const results = [];
    let matchCount = 0;
    const batchSize = 8;
    onProgress({ done: 0, total: pdf.numPages });
    for (let first = 1; first <= pdf.numPages; first += batchSize) {
      const last = Math.min(pdf.numPages, first + batchSize - 1);
      const pageData = await Promise.all(Array.from({ length: last - first + 1 }, async (_, offset) => {
        const pageNumber = first + offset;
        if (cache.has(pageNumber)) return cache.get(pageNumber);
        const page = await pdf.getPage(pageNumber);
        const content = await page.getTextContent();
        const items = content.items.filter(item => typeof item.str === 'string' && item.str.trim());
        const entry = { pageNumber, items, text: items.map(item => item.str).join(' '), pageHeight: Math.max(1, page.view[3] - page.view[1]), pageBottom: page.view[1] };
        cache.set(pageNumber, entry);
        return entry;
      }));
      if (generation !== state.generation || pdf !== state.pdf) return { available: false, changed: true, localFileMode };
      for (const { pageNumber, items, text, pageHeight, pageBottom } of pageData) {
        const normalized = clean(text);
        const compact = normalized.replace(/\s/g, '');
        const normalIndex = normalized.indexOf(wanted);
        const compactIndex = compact.indexOf(compactWanted);
        if (normalIndex < 0 && compactIndex < 0) continue;
        matchCount += 1;
        if (results.length >= 50) continue;
        const firstWord = wanted.split(' ')[0];
        const item = items.find(part => clean(part.str).includes(firstWord)) || items[0];
        const fallbackIndex = item ? Math.max(0, text.indexOf(item.str)) : 0;
        const index = normalIndex >= 0 ? normalIndex : fallbackIndex;
        const snippet = text.slice(Math.max(0, index - 75), Math.min(text.length, index + wanted.length + 125)).replace(/\s+/g, ' ').trim();
        const fraction = item?.transform ? Math.max(0, Math.min(0.98, 1 - (item.transform[5] - pageBottom) / pageHeight)) : 0;
        results.push({ page: pageNumber, fraction, snippet });
      }
      onProgress({ done: last, total: pdf.numPages });
    }
    return { available: true, results, matchCount, searchable: matchCount > 0 || pdf.numPages > 0 };
  };
  window.openPdfSearchHit = (page, fraction = 0) => {
    if (!state.pdf || state.pageNodes.length === 0) return false;
    byId('acts').scrollIntoView({ behavior: 'smooth', block: 'start' });
    scrollToPage(page, fraction, true);
    return true;
  };
  window.setActReaderLanguage = setActReaderLanguage;
})();