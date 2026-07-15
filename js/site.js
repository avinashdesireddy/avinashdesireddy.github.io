/* site.js — fetches _data/*.json and renders the page */
(function () {
  'use strict';

  /* ── helpers ── */
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'className') node.className = attrs[k];
      else if (k === 'textContent') node.textContent = attrs[k];
      else if (k === 'innerHTML') node.innerHTML = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    if (children) children.forEach(function (c) { if (c) node.appendChild(c); });
    return node;
  }

  function fetchJSON(path) {
    return fetch(path + '?v=' + Date.now())
      .then(function (r) {
        if (!r.ok) throw new Error('Failed to load ' + path);
        return r.json();
      });
  }

  function formatDate(iso) {
    if (!iso) return '—';
    var d = new Date(iso + 'T00:00:00');
    return (d.getMonth() + 1).toString().padStart(2, '0') + '/'
         + d.getDate().toString().padStart(2, '0');
  }

  function formatYear(iso) {
    if (!iso) return 'drafts';
    return iso.split('-')[0];
  }

  /* inline link badges — repo / slides / workshop */
  function buildLinks(linksArr) {
    if (!linksArr || !linksArr.length) return null;
    var wrap = el('span', { className: 'item-links' });
    linksArr.forEach(function (lnk) {
      wrap.appendChild(
        el('a', {
          className: 'item-link',
          href: lnk.url,
          target: '_blank',
          rel: 'noopener',
          textContent: lnk.label + ' ↗'
        })
      );
    });
    return wrap;
  }

  /* ── sidebar ── */
  function renderSidebar(profile) {
    document.querySelector('.name').textContent = profile.name;
    document.querySelector('.handle').textContent = profile.handle;

    var bioEl = document.querySelector('.bio');
    bioEl.innerHTML = '';
    profile.bio.forEach(function (line) {
      bioEl.appendChild(el('p', { textContent: line }));
    });

    document.querySelector('.page-intro').textContent = profile.tagline;

    var linksEl = document.querySelector('.slinks');
    linksEl.innerHTML = '';
    profile.links.forEach(function (lnk) {
      linksEl.appendChild(
        el('li', null, [
          el('a', { href: lnk.url, target: '_blank', rel: 'noopener', textContent: lnk.label })
        ])
      );
    });

    /* GA */
    if (profile.analytics) {
      var s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + profile.analytics;
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      function gtag(){ window.dataLayer.push(arguments); }
      gtag('js', new Date());
      gtag('config', profile.analytics);
    }
  }

  /* ── posts ── */
  function renderPosts(posts) {
    var published = posts.filter(function (p) { return p.status === 'published'; });

    /* collect tags */
    var tagSet = { all: true };
    posts.forEach(function (p) {
      (p.tags || []).forEach(function (t) { tagSet[t] = true; });
    });

    var filterEl = document.getElementById('tag-filter');
    filterEl.innerHTML = '';
    Object.keys(tagSet).forEach(function (tag) {
      filterEl.appendChild(el('button', {
        className: 'tag' + (tag === 'all' ? ' active' : ''),
        textContent: tag,
        'data-tag': tag
      }));
    });

    var container = document.getElementById('posts-container');
    container.innerHTML = '';

    /* group by year */
    var byYear = {}, yearOrder = [];
    published.forEach(function (p) {
      var yr = formatYear(p.date);
      if (!byYear[yr]) { byYear[yr] = []; yearOrder.push(yr); }
      byYear[yr].push(p);
    });

    yearOrder.forEach(function (yr) {
      var group = el('div', { className: 'yr-group', 'data-year': yr });

      /* year label — derive annotation from posts in each year */
      var yrAnnotation;
      if (yr === '2025') yrAnnotation = 'AWS Big Data Blog';
      else if (yr === '2026') yrAnnotation = 'AWS Big Data Blog';
      else yrAnnotation = 'Mirantis · Lens · Medium';
      var yrLabel = yr + ' — ' + yrAnnotation;
      group.appendChild(el('div', { className: 'yr', textContent: yrLabel }));

      byYear[yr].forEach(function (p) {
        var row = el('div', { className: 'post-row', 'data-tags': (p.tags || []).join(',') });
        row.appendChild(el('div', { className: 'pdate', textContent: formatDate(p.date) }));

        var content = el('div', null);
        if (p.url) {
          content.appendChild(el('a', { className: 'ptitle', href: p.url, target: '_blank', rel: 'noopener', textContent: p.title }));
        } else {
          content.appendChild(el('span', { className: 'ptitle', textContent: p.title }));
        }

        var meta = el('div', { className: 'pmeta' });
        (p.tags || []).forEach(function (t) {
          meta.appendChild(el('span', { className: 'ptag', textContent: t }));
        });
        if (p.venue) meta.appendChild(el('span', { className: 'pvenue', textContent: p.venue }));

        var lnks = buildLinks(p.links);
        if (lnks) meta.appendChild(lnks);

        content.appendChild(meta);
        row.appendChild(content);
        group.appendChild(row);
      });

      container.appendChild(group);
    });
  }

  /* ── workshops ── */
  function renderWorkshops(items) {
    var container = document.getElementById('workshops-container');
    container.innerHTML = '';
    container.appendChild(el('div', { className: 'section-head workshops-head', textContent: 'Workshops' }));

    items.forEach(function (t) {
      var row = el('div', { className: 'talk-row', 'data-tags': (t.tags || []).join(',') });
      row.appendChild(el('div', { className: 'tdate', textContent: t.date || '—' }));

      var info = el('div', null);
      var titleNode = t.url
        ? el('a', { className: 'ttitle', href: t.url, target: '_blank', rel: 'noopener', textContent: t.title })
        : el('div', { className: 'ttitle', textContent: t.title });
      info.appendChild(titleNode);

      var venueStr = [t.venue, t.detail].filter(Boolean).join(' · ');
      if (venueStr) info.appendChild(el('div', { className: 'tvenue', textContent: venueStr }));

      var lnks = buildLinks(t.links);
      if (lnks) info.appendChild(lnks);

      row.appendChild(info);
      container.appendChild(row);
    });
  }

  /* ── talks ── */
  function renderTalks(talks) {
    var container = document.getElementById('talks-container');
    container.innerHTML = '';
    container.appendChild(el('div', { className: 'section-head talks-head', textContent: 'Talks' }));

    talks.forEach(function (t) {
      var row = el('div', { className: 'talk-row', 'data-tags': (t.tags || []).join(',') });
      row.appendChild(el('div', { className: 'tdate', textContent: t.date || '—' }));

      var info = el('div', null);
      var titleNode = t.url
        ? el('a', { className: 'ttitle', href: t.url, target: '_blank', rel: 'noopener', textContent: t.title })
        : el('div', { className: 'ttitle', textContent: t.title });
      info.appendChild(titleNode);

      var venueStr = [t.venue, t.detail].filter(Boolean).join(' · ');
      if (venueStr) info.appendChild(el('div', { className: 'tvenue', textContent: venueStr }));

      var lnks = buildLinks(t.links);
      if (lnks) info.appendChild(lnks);

      row.appendChild(info);
      container.appendChild(row);
    });
  }

  /* ── open source ── */
  function renderOSS(items) {
    if (!items || !items.length) return;
    var container = document.getElementById('oss-container');
    if (!container) return;
    container.innerHTML = '';
    container.appendChild(el('div', { className: 'section-head oss-head', textContent: 'Open source' }));

    items.forEach(function (item) {
      var row = el('div', { className: 'oss-row' });

      var top = el('div', { className: 'oss-top' });
      top.appendChild(el('a', { className: 'oss-title', href: item.url, target: '_blank', rel: 'noopener', textContent: item.title }));
      if (item.stat) top.appendChild(el('span', { className: 'oss-stat', textContent: item.stat }));
      row.appendChild(top);

      if (item.description) row.appendChild(el('div', { className: 'oss-desc', textContent: item.description }));

      var meta = el('div', { className: 'pmeta' });
      (item.tags || []).forEach(function (t) {
        meta.appendChild(el('span', { className: 'ptag', textContent: t }));
      });
      row.appendChild(meta);

      container.appendChild(row);
    });
  }

  /* ── tabs ── */
  function renderTabs(tabs) {
    var tabBar = document.getElementById('tab-bar');
    tabBar.innerHTML = '';
    tabs.forEach(function (t, i) {
      tabBar.appendChild(el('button', {
        className: 'tab' + (i === 0 ? ' active' : ''),
        'data-tab': t.key,
        role: 'tab',
        'aria-selected': i === 0 ? 'true' : 'false',
        textContent: t.label
      }));
    });
  }

  function initTabs() {
    var tabBar = document.getElementById('tab-bar');
    tabBar.addEventListener('click', function (e) {
      if (!e.target.matches('.tab')) return;
      tabBar.querySelectorAll('.tab').forEach(function (t) {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      e.target.classList.add('active');
      e.target.setAttribute('aria-selected', 'true');

      var target = e.target.dataset.tab;
      document.querySelectorAll('.tab-panel').forEach(function (p) {
        if (target === 'all') {
          p.classList.add('active');
        } else {
          p.classList.toggle('active', p.id === target + '-container');
        }
      });
    });
  }

  /* ── filter (posts + talks) ── */
  function initFilter() {
    var filterEl = document.getElementById('tag-filter');
    filterEl.addEventListener('click', function (e) {
      if (!e.target.matches('.tag')) return;
      var selected = e.target.dataset.tag;

      filterEl.querySelectorAll('.tag').forEach(function (b) { b.classList.remove('active'); });
      e.target.classList.add('active');

      var allRows = document.querySelectorAll('.post-row, .talk-row');
      allRows.forEach(function (row) {
        var rowTags = (row.dataset.tags || '').split(',');
        row.style.display = (selected === 'all' || rowTags.indexOf(selected) !== -1) ? '' : 'none';
      });

      var allGroups = document.querySelectorAll('.yr-group');
      allGroups.forEach(function (g) {
        var anyVisible = Array.prototype.some.call(
          g.querySelectorAll('.post-row'),
          function (r) { return r.style.display !== 'none'; }
        );
        g.style.display = anyVisible ? '' : 'none';
      });
    });
  }

  /* ── init ── */
  Promise.all([
    fetchJSON('_data/profile.json'),
    fetchJSON('_data/posts.json'),
    fetchJSON('_data/workshops.json'),
    fetchJSON('_data/talks.json'),
    fetchJSON('_data/oss.json'),
    fetchJSON('_data/tabs.json')
  ]).then(function (results) {
    renderSidebar(results[0]);
    renderPosts(results[1]);
    renderWorkshops(results[2]);
    renderTalks(results[3]);
    renderOSS(results[4]);
    renderTabs(results[5]);
    initTabs();
    initFilter();
  }).catch(function (err) {
    console.error('Site data load error:', err);
  });

})();
