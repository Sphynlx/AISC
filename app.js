/**
 * APP LOGIC: PHIÊN DỊCH VĂN HOÁ SỐ (DIGITAL CULTURAL INTERPRETER)
 * AISC'26 - Team Asteria (UIT - ĐHQG TP.HCM)
 * Multi-layer Architecture & Workflow Simulation
 */

// Global State
let currentView = 'chat';
let currentCountryFilter = 'ALL';
let currentDomainFilter = 'ALL';
let activeDashboardTab = 'overview';
let userContext = {
  country: 'JP',
  purpose: 'DU_HOC',
  stage: 'PREPARING'
};

let likertValues = {
  prep: 3,
  intention: 4
};

// ===================================================================
// INITIALIZATION
// ===================================================================
document.addEventListener('DOMContentLoaded', () => {
  initDomainFilters();
  initSamplePrompts();
  renderEvidenceCards();
  initSurveyDomainSelect();
  renderAdminQueue();
  updateUserContext();
  updateQueueBadge();

  // Check saved theme
  const savedTheme = localStorage.getItem('app-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
});

// ===================================================================
// NAVIGATION & VIEW SWITCHING
// ===================================================================
function switchView(viewId) {
  currentView = viewId;

  // Toggle sections
  document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
  const targetSection = document.getElementById(`view-${viewId}`);
  if (targetSection) targetSection.classList.add('active');

  // Toggle navbar buttons
  document.querySelectorAll('.nav-tab-btn').forEach(btn => btn.classList.remove('active'));
  const targetBtn = document.getElementById(`tab-btn-${viewId}`);
  if (targetBtn) targetBtn.classList.add('active');

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===================================================================
// THEME SWITCHER
// ===================================================================
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('app-theme', newTheme);
  updateThemeIcon(newTheme);
  showToast(`Đã chuyển sang giao diện ${newTheme === 'dark' ? 'Tối' : 'Sáng'}`);
}

function updateThemeIcon(theme) {
  const icon = document.getElementById('themeToggleIcon');
  const text = document.getElementById('themeToggleText');
  if (icon) icon.textContent = theme === 'light' ? '☀️' : '🌙';
  if (text) text.textContent = theme === 'light' ? 'Sáng' : 'Tối';
}

// ===================================================================
// USER CONTEXT & PROFILES
// ===================================================================
function updateUserContext() {
  userContext.country = document.getElementById('chatUserCountry').value;
  userContext.purpose = document.getElementById('chatUserPurpose').value;
  userContext.stage = document.getElementById('chatUserStage').value;

  const countryObj = APP_DATA.countries.find(c => c.id === userContext.country) || APP_DATA.countries[0];
  const purposeLabel = userContext.purpose === 'DU_HOC' ? 'Du học sinh' : (userContext.purpose === 'LAO_DONG' ? 'Lao động kỹ năng' : 'Định cư');
  const stageLabel = userContext.stage === 'PREPARING' ? 'Chuẩn bị đi' : (userContext.stage === 'RECENT_ARRIVED' ? 'Mới sang < 6 tháng' : 'Đang sinh sống > 1 năm');

  // Update header badges
  const headerAvatar = document.getElementById('headerProfileAvatar');
  const headerLabel = document.getElementById('headerProfileLabel');
  if (headerAvatar) headerAvatar.textContent = userContext.country;
  if (headerLabel) headerLabel.textContent = `${countryObj.name} • ${purposeLabel}`;

  // Update chat context active label
  const chatContextLabel = document.getElementById('chatContextActiveLabel');
  if (chatContextLabel) {
    chatContextLabel.textContent = `Ngữ cảnh: ${countryObj.flag} ${countryObj.name} • ${purposeLabel} • ${stageLabel}`;
  }

  // Refresh sample prompt chips based on selected country
  initSamplePrompts();
}

// ===================================================================
// CHATBOT RAG PIPELINE & INTERACTION
// ===================================================================
function initSamplePrompts() {
  const container = document.getElementById('samplePromptContainer');
  if (!container) return;

  // Filter or prioritize queries for selected country
  const relevantQueries = APP_DATA.sampleQueries.filter(q => q.country === userContext.country);
  const otherQueries = APP_DATA.sampleQueries.filter(q => q.country !== userContext.country);
  const displayQueries = [...relevantQueries, ...otherQueries].slice(0, 4);

  container.innerHTML = displayQueries.map(q => `
    <button class="prompt-chip" onclick="handlePromptClick('${escapeHtml(q.text)}')">
      <span style="font-weight: 600; color: var(--text-primary); display: block; margin-bottom: 2px;">
        ${q.country === 'JP' ? '🇯🇵' : (q.country === 'KR' ? '🇰🇷' : '🇦🇺')} ${escapeHtml(q.tags.join(' • '))}
      </span>
      ${escapeHtml(q.text)}
    </button>
  `).join('');
}

function handlePromptClick(promptText) {
  const input = document.getElementById('chatInput');
  if (input) {
    input.value = promptText;
    sendUserMessage();
  }
}

function handleChatKeyDown(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    sendUserMessage();
  }
}

function sendUserMessage() {
  const input = document.getElementById('chatInput');
  const query = input.value.trim();
  if (!query) return;

  // Append User Message
  appendMessage({
    sender: 'user',
    text: query
  });

  input.value = '';

  // Simulate RAG Pipeline steps
  simulateRagPipeline(query);
}

function simulateRagPipeline(query) {
  const pipelineStatus = document.getElementById('ragPipelineStatus');
  const pipelineSteps = document.getElementById('ragPipelineSteps');

  if (pipelineStatus) pipelineStatus.textContent = 'EXECUTING...';
  if (pipelineSteps) {
    pipelineSteps.innerHTML = `
      <span style="color: var(--accent-secondary);">[1/4] Phân loại Lĩnh vực (Intent Detection)...</span>
    `;
  }

  setTimeout(() => {
    if (pipelineSteps) {
      pipelineSteps.innerHTML = `
        <span style="color: var(--accent-emerald);">[2/4] Lọc cứng Metadata (${userContext.country}, ${userContext.purpose})...</span>
      `;
    }
  }, 400);

  setTimeout(() => {
    if (pipelineSteps) {
      pipelineSteps.innerHTML = `
        <span style="color: var(--accent-purple);">[3/4] Vector Cosine Similarity Search (Mart Modeling)...</span>
      `;
    }
  }, 800);

  setTimeout(() => {
    if (pipelineSteps) {
      pipelineSteps.innerHTML = `
        <span style="color: var(--text-accent);">[4/4] LLM Structured Synthesis with Citations...</span>
      `;
    }

    // Generate RAG Response
    const responseData = generateRagResponse(query);
    appendMessage({
      sender: 'bot',
      ragData: responseData
    });

    if (pipelineStatus) pipelineStatus.textContent = 'DONE (200 OK)';
    setTimeout(() => {
      if (pipelineStatus) pipelineStatus.textContent = 'IDLE';
      if (pipelineSteps) {
        pipelineSteps.innerHTML = `1. Phân loại Lĩnh vực (Intent) → 2. Lọc cứng Metadata → 3. Vector Cosine Search → 4. LLM Synthesis`;
      }
    }, 2000);

  }, 1300);
}

function generateRagResponse(query) {
  const lowerQuery = query.toLowerCase();

  // Search through Evidence Cards with priority for user's selected country
  let matchedCard = APP_DATA.evidenceCards.find(card => {
    const textCorpus = `${card.title} ${card.context} ${card.verifiedContent} ${card.safeAction}`.toLowerCase();
    
    // Check key topic matches
    if (lowerQuery.includes('vỡ bát') || lowerQuery.includes('bát đĩa') || lowerQuery.includes('baito')) {
      return card.id === 'EVD-JP-001';
    }
    if (lowerQuery.includes('thường trú') || lowerQuery.includes('28h') || lowerQuery.includes('my number') || lowerQuery.includes('kuyakusho')) {
      return card.id === 'EVD-JP-002';
    }
    if (lowerQuery.includes('rác') || lowerQuery.includes('tiếng ồn') || lowerQuery.includes('apato') || lowerQuery.includes('phân loại')) {
      return card.id === 'EVD-JP-003';
    }
    if (lowerQuery.includes('kính ngữ') || lowerQuery.includes('sunbae') || lowerQuery.includes('tiền bối') || lowerQuery.includes('hai tay')) {
      return card.id === 'EVD-KR-001';
    }
    if (lowerQuery.includes('bàn ăn') || lowerQuery.includes('hoesik') || lowerQuery.includes('rót rượu') || lowerQuery.includes('cắm đũa')) {
      return card.id === 'EVD-KR-002';
    }
    if (lowerQuery.includes('nhis') || lowerQuery.includes('bảo hiểm y tế') || lowerQuery.includes('viện phí')) {
      return card.id === 'EVD-KR-003';
    }
    if (lowerQuery.includes('lương') || lowerQuery.includes('fair work') || lowerQuery.includes('visa 500') || lowerQuery.includes('48h')) {
      return card.id === 'EVD-AU-001';
    }
    if (lowerQuery.includes('first name') || lowerQuery.includes('small talk') || lowerQuery.includes('xưng hô') || lowerQuery.includes('cảm ơn tài xế')) {
      return card.id === 'EVD-AU-002';
    }
    if (lowerQuery.includes('tip') || lowerQuery.includes('tiền tip') || lowerQuery.includes('split') || lowerQuery.includes('hóa đơn')) {
      return card.id === 'EVD-AU-003';
    }

    return false;
  });

  // If no direct keyword match, search by country & general keywords
  if (!matchedCard) {
    matchedCard = APP_DATA.evidenceCards.find(c => c.country === userContext.country);
  }

  if (matchedCard) {
    return {
      success: true,
      card: matchedCard,
      contextAnalysis: `Bối cảnh thuộc lĩnh vực "${matchedCard.domainName}" tại ${matchedCard.countryName}. Tình huống liên quan trực tiếp đến quy tắc ứng xử thực tế và chuẩn mực hành chính của nước sở tại mà du học sinh/người lao động thường gặp.`,
      safeAction: matchedCard.safeAction,
      donots: matchedCard.donots,
      confidence: matchedCard.reliabilityScore,
      confidenceLevel: matchedCard.confidenceLevel
    };
  }

  // Refusal case when insufficient evidence (as strictly mandated by proposal page 7)
  return {
    success: false,
    refusalMessage: "Hiện cơ sở tri thức đã kiểm chứng của hệ thống chưa có đủ bằng chứng (Evidence Card) với độ tin cậy đạt chuẩn cho truy vấn cụ thể này. Để tránh suy diễn sai lệch, hệ thống từ chối đưa ra kết luận và khuyến nghị bạn tra cứu trực tiếp tại website của Đại sứ quán hoặc Cơ quan thẩm quyền nước sở tại."
  };
}

const STAR_ICON_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 6.9L21.3 10l-5.3 4.6 1.6 7.1L12 18l-5.6 3.7 1.6-7.1L2.7 10l6.9-1.1L12 2z"/></svg>`;

function appendMessage({ sender, text, ragData }) {
  const container = document.getElementById('chatMessages');
  if (!container) return;

  const welcomeHero = document.getElementById('chatWelcomeHero');
  if (welcomeHero) welcomeHero.remove();

  const row = document.createElement('div');
  row.className = `message-row ${sender}`;

  if (sender === 'user') {
    row.innerHTML = `
      <div class="message-avatar">👤</div>
      <div class="message-bubble">
        <p>${escapeHtml(text)}</p>
      </div>
    `;
  } else {
    // BOT RAG Response
    if (ragData && ragData.success) {
      const card = ragData.card;
      row.innerHTML = `
        <div class="message-avatar">${STAR_ICON_SVG}</div>
        <div class="message-bubble">
          <div class="rag-response-card">
            <!-- Header Badges -->
            <div class="rag-header-badge">
              <div style="display: flex; gap: 6px; align-items: center;">
                <span class="badge-country">${card.countryName}</span>
                <span class="badge-domain">${card.domainName}</span>
              </div>
              <span class="confidence-chip confidence-high">
                <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Groundedness: ${ragData.confidence}% (${ragData.confidenceLevel})
              </span>
            </div>

            <!-- 1. Phân Tích Bối Cảnh -->
            <div class="rag-section-block block-context">
              <h4>
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                1. Phân tích bối cảnh & Ngữ cảnh văn hóa
              </h4>
              <p>${escapeHtml(ragData.contextAnalysis)}</p>
              <p style="margin-top: 0.35rem; font-size: 0.82rem; opacity: 0.9;"><strong>Thực tế kiểm chứng:</strong> ${escapeHtml(card.verifiedContent)}</p>
            </div>

            <!-- 2. Hành Vi Ứng Xử An Toàn -->
            <div class="rag-section-block block-safe">
              <h4>
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                2. Hành vi ứng xử an toàn được đề xuất (Recommended Safe Action)
              </h4>
              <p>${escapeHtml(ragData.safeAction)}</p>
            </div>

            <!-- 3. Điều Cần Tránh -->
            <div class="rag-section-block block-donot">
              <h4>
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                3. Điều cần tránh (Don'ts / Rủi ro tiềm ẩn)
              </h4>
              <p>${escapeHtml(ragData.donots)}</p>
            </div>

            <!-- 4. Thẻ Trích Dẫn Nguồn Kiểm Chứng -->
            <div class="block-evidence">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                <span class="evidence-source-tag">🏷️ Evidence Card [${card.id}]</span>
                <span style="font-size: 0.72rem; color: var(--accent-emerald);">● Xác minh: ${card.verifiedDate}</span>
              </div>
              <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.25rem;">${escapeHtml(card.title)}</div>
              <div style="font-size: 0.78rem; color: var(--text-secondary);">Tổ chức kiểm chứng: <strong>${escapeHtml(card.organization)}</strong> (${escapeHtml(card.sourceType)})</div>
              <div class="evidence-meta-row">
                <a href="${card.sourceUrl}" target="_blank" rel="noopener">
                  🔗 Xem nguồn tham chiếu gốc ↗
                </a>
                <button class="btn-card-action" onclick="openEvidenceDetailModal('${card.id}')">Xem chi tiết thẻ</button>
              </div>
            </div>

            <!-- Feedback & Actions -->
            <div class="chat-feedback-actions">
              <span style="font-size: 0.75rem; color: var(--text-muted);">Phản hồi:</span>
              <button class="btn-feedback" onclick="handleFeedback(this, 'like')">
                👍 Hữu ích
              </button>
              <button class="btn-feedback" onclick="handleFeedback(this, 'report', '${card.id}')">
                🚩 Báo lỗi
              </button>
              <button class="btn-feedback" onclick="copyResponse(this)">
                📋 Sao chép
              </button>
            </div>
          </div>
        </div>
      `;
    } else {
      // Refusal message
      row.innerHTML = `
        <div class="message-avatar">${STAR_ICON_SVG}</div>
        <div class="message-bubble">
          <div style="border-left: 3px solid var(--accent-amber); padding-left: 0.75rem;">
            <strong style="color: var(--accent-amber); display: block; margin-bottom: 0.35rem;">⚠️ Từ chối trả lời (Nguyên tắc an toàn dữ liệu)</strong>
            <p>${escapeHtml(ragData.refusalMessage)}</p>
          </div>
        </div>
      `;
    }
  }

  container.appendChild(row);
  container.scrollTop = container.scrollHeight;
}

function copyResponse(btn) {
  const card = btn.closest('.rag-response-card');
  if (!card) return;
  const safeBlock = card.querySelector('.block-safe p');
  const textToCopy = safeBlock ? safeBlock.innerText : card.innerText;

  navigator.clipboard.writeText(textToCopy).then(() => {
    btn.innerHTML = '✓ Đã chép';
    showToast('Đã sao chép hành vi ứng xử an toàn vào clipboard!');
    setTimeout(() => {
      btn.innerHTML = '📋 Sao chép';
    }, 2000);
  }).catch(() => {
    showToast('Sao chép thành công!');
  });
}

function handleFeedback(btn, type, cardId) {
  if (type === 'like') {
    btn.classList.add('liked');
    btn.innerHTML = '✓ Đã ghi nhận';
    showToast('Cảm ơn bạn đã phản hồi câu trả lời hữu ích!');
  } else {
    btn.classList.add('reported');
    // Prompt or add ticket to admin queue
    const ticketId = `REV-TKT-${Date.now().toString().slice(-4)}`;
    APP_DATA.adminQueue.unshift({
      id: ticketId,
      type: 'TICKET_FEEDBACK',
      submitter: 'Người dùng tương tác (Ẩn danh)',
      country: userContext.country,
      countryName: userContext.country === 'JP' ? 'Nhật Bản' : (userContext.country === 'KR' ? 'Hàn Quốc' : 'Australia'),
      domainId: 'giao_tiep',
      domainName: 'Giao tiếp – Văn hoá',
      submittedAt: new Date().toLocaleString(),
      title: `Báo cáo câu trả lời của thẻ ${cardId || 'RAG'}`,
      experienceText: `Người dùng gửi phản hồi cần hiệu đính nguồn và nội dung ứng xử cho câu hỏi vừa qua.`,
      sourceCredibility: 'Phản hồi người dùng trực tiếp',
      status: 'PENDING'
    });

    updateQueueBadge();
    renderAdminQueue();
    showToast(`Đã tạo Ticket kiểm duyệt #${ticketId} vào Hàng đợi của Admin!`);
  }
}

// ===================================================================
// EVIDENCE CARDS EXPLORER
// ===================================================================
const DOMAIN_SHORT_NAMES = {
  'phap_ly': '⚖️ Pháp lý',
  'cong_viec': '💼 Việc làm',
  'giao_tiep': '💬 Ứng xử',
  'nha_o': '🏠 Nhà ở',
  'tai_chinh': '💳 Tài chính',
  'y_te': '🏥 Y tế',
  'giao_thong': '🚆 Đi lại',
  'doi_song': '🍜 Ẩm thực',
  'cong_dong': '👥 Cộng đồng'
};

function initDomainFilters() {
  const container = document.getElementById('domainFilterPills');
  if (!container) return;

  container.innerHTML = `
    <button class="domain-chip active" data-domain="ALL" onclick="setDomainFilter('ALL')">
      Tất cả (All)
    </button>
  ` + APP_DATA.domains.map(d => `
    <button class="domain-chip" data-domain="${d.id}" onclick="setDomainFilter('${d.id}')">
      ${DOMAIN_SHORT_NAMES[d.id] || escapeHtml(d.name)}
    </button>
  `).join('');
}

function setCountryFilter(country) {
  currentCountryFilter = country;
  document.querySelectorAll('.filter-pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.country === country);
  });
  filterEvidenceCards();
}

function setDomainFilter(domainId) {
  currentDomainFilter = domainId;
  document.querySelectorAll('.domain-chip').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.domain === domainId);
  });
  filterEvidenceCards();
}

function filterEvidenceCards() {
  const searchInput = document.getElementById('explorerSearchInput');
  const query = (searchInput ? searchInput.value : '').toLowerCase().trim();

  const filtered = APP_DATA.evidenceCards.filter(card => {
    // Country filter
    const matchCountry = currentCountryFilter === 'ALL' || card.country === currentCountryFilter;
    // Domain filter
    const matchDomain = currentDomainFilter === 'ALL' || card.domainId === currentDomainFilter;
    // Search query
    const matchQuery = !query || 
      card.title.toLowerCase().includes(query) ||
      card.context.toLowerCase().includes(query) ||
      card.verifiedContent.toLowerCase().includes(query) ||
      card.organization.toLowerCase().includes(query);

    return matchCountry && matchDomain && matchQuery;
  });

  renderEvidenceCards(filtered);
}

function renderEvidenceCards(cards = APP_DATA.evidenceCards) {
  const container = document.getElementById('evidenceCardsGrid');
  if (!container) return;

  if (cards.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-subtle);">
        <p style="color: var(--text-muted); font-size: 0.95rem;">Không tìm thấy thẻ bằng chứng phù hợp với bộ lọc hiện tại.</p>
        <button class="btn-feedback" style="margin: 0.75rem auto 0 auto;" onclick="resetExplorerFilters()">Đặt lại bộ lọc</button>
      </div>
    `;
    return;
  }

  container.innerHTML = cards.map(card => `
    <div class="evidence-card">
      <div>
        <div class="card-top-header">
          <div class="card-badges">
            <span class="badge-country">${card.country === 'JP' ? '🇯🇵' : (card.country === 'KR' ? '🇰🇷' : '🇦🇺')} ${card.countryName}</span>
            <span class="badge-domain">${card.domainName}</span>
          </div>
          <div class="badge-reliability">
            <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            ${card.reliabilityScore}%
          </div>
        </div>

        <h3 class="card-title" style="margin-top: 0.65rem;">${escapeHtml(card.title)}</h3>

        <div class="card-context-box" style="margin-top: 0.5rem;">
          <strong>Bối cảnh:</strong> ${escapeHtml(card.context)}
        </div>

        <p class="card-content-preview" style="margin-top: 0.6rem;">
          ${escapeHtml(card.verifiedContent)}
        </p>
      </div>

      <div class="card-footer">
        <div>
          <span style="display: block; font-weight: 600; color: var(--text-primary); font-size: 0.75rem;">${escapeHtml(card.organization)}</span>
          <span style="font-size: 0.7rem;">Xác minh: ${card.verifiedDate}</span>
        </div>
        <button class="btn-card-action" onclick="openEvidenceDetailModal('${card.id}')">
          Xem chi tiết
        </button>
      </div>
    </div>
  `).join('');
}

function resetExplorerFilters() {
  currentCountryFilter = 'ALL';
  currentDomainFilter = 'ALL';
  const searchInput = document.getElementById('explorerSearchInput');
  if (searchInput) searchInput.value = '';
  document.querySelectorAll('.filter-pill').forEach(btn => btn.classList.toggle('active', btn.dataset.country === 'ALL'));
  document.querySelectorAll('.domain-chip').forEach(btn => btn.classList.toggle('active', btn.dataset.domain === 'ALL'));
  renderEvidenceCards();
}

function openEvidenceDetailModal(cardId) {
  const card = APP_DATA.evidenceCards.find(c => c.id === cardId);
  if (!card) return;

  const modal = document.getElementById('evidenceDetailModal');
  const title = document.getElementById('modalCardTitle');
  const badges = document.getElementById('modalCardBadges');
  const body = document.getElementById('modalCardBody');

  title.textContent = card.title;
  badges.innerHTML = `
    <span class="badge-country">${card.countryName}</span>
    <span class="badge-domain">${card.domainName}</span>
    <span class="confidence-chip confidence-high">Mã: ${card.id} • Độ tin cậy: ${card.reliabilityScore}%</span>
  `;

  body.innerHTML = `
    <div class="card-context-box">
      <strong>Bối cảnh áp dụng:</strong> ${escapeHtml(card.context)}
    </div>

    <div>
      <h4 style="color: var(--text-accent); font-size: 0.85rem; text-transform: uppercase; margin-bottom: 0.35rem;">Nội dung đã kiểm chứng (Verified Facts)</h4>
      <p style="font-size: 0.9rem; line-height: 1.5;">${escapeHtml(card.verifiedContent)}</p>
    </div>

    <div class="rag-section-block block-safe">
      <h4 style="margin-bottom: 0.3rem;">Hành vi ứng xử an toàn (Recommended Action):</h4>
      <p style="font-size: 0.85rem;">${escapeHtml(card.safeAction)}</p>
    </div>

    <div class="rag-section-block block-donot">
      <h4 style="margin-bottom: 0.3rem;">Điều tuyệt đối cần tránh / Ngoại lệ (Don'ts):</h4>
      <p style="font-size: 0.85rem;">${escapeHtml(card.donots)}</p>
    </div>

    <div style="background: rgba(0,0,0,0.25); border-radius: var(--radius-md); padding: 0.85rem; font-size: 0.8rem; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <div style="color: #fff; font-weight: 700;">Nguồn: ${escapeHtml(card.organization)}</div>
        <div style="color: var(--text-muted);">Phân loại: ${escapeHtml(card.sourceType)} • Ngày xác minh: ${card.verifiedDate}</div>
      </div>
      <a href="${card.sourceUrl}" target="_blank" rel="noopener" class="btn-card-action" style="text-decoration: none;">
        Xem tài liệu gốc ↗
      </a>
    </div>
  `;

  modal.classList.add('active');
}

// ===================================================================
// COMMUNITY SURVEY FORM & ANONYMIZATION (MỤC 10 ĐỀ ÁN)
// ===================================================================
function initSurveyDomainSelect() {
  const select = document.getElementById('surveyExpDomain');
  if (!select) return;

  select.innerHTML = APP_DATA.domains.map(d => `
    <option value="${d.id}">${escapeHtml(d.name)}</option>
  `).join('');
}

function setLikert(type, value) {
  likertValues[type] = value;
  const container = document.getElementById(type === 'prep' ? 'surveyPrepScale' : 'surveyIntentionScale');
  if (!container) return;

  const options = container.querySelectorAll('.likert-option');
  options.forEach((opt, idx) => {
    opt.classList.toggle('selected', idx + 1 === value);
  });
}

function handleSurveySubmit(event) {
  event.preventDefault();

  const country = document.getElementById('surveyCountry').value;
  const purpose = document.getElementById('surveyPurpose').value;
  const stage = document.getElementById('surveyStage').value;
  const expTitle = document.getElementById('surveyExpTitle').value.trim();
  const expDomain = document.getElementById('surveyExpDomain').value;
  const expText = document.getElementById('surveyExpText').value.trim();

  const countryName = country === 'JP' ? 'Nhật Bản' : (country === 'KR' ? 'Hàn Quốc' : 'Australia');
  const domainObj = APP_DATA.domains.find(d => d.id === expDomain) || APP_DATA.domains[0];

  const newId = `REV-2026-${(APP_DATA.adminQueue.length + 1).toString().padStart(3, '0')}`;

  // Add into Admin Queue (Image 2 & 3 flow)
  const newQueueItem = {
    id: newId,
    type: 'SURVEY_SUBMISSION',
    submitter: 'Du học sinh đóng góp (PII Anonymized)',
    country: country,
    countryName: countryName,
    domainId: expDomain,
    domainName: domainObj.name,
    submittedAt: new Date().toLocaleString(),
    title: expTitle,
    experienceText: expText,
    sourceCredibility: 'Khảo sát cộng đồng đã khử định danh PII',
    status: 'PENDING',
    proposedCard: {
      title: expTitle,
      safeAction: expText.slice(0, 120) + '...',
      donots: 'Tránh hành động tự phát khi chưa nắm rõ quy định bản địa.'
    }
  };

  APP_DATA.adminQueue.unshift(newQueueItem);

  // Reset form
  document.getElementById('communitySurveyForm').reset();
  setLikert('prep', 3);
  setLikert('intention', 4);

  // Update badges & admin view
  updateQueueBadge();
  renderAdminQueue();

  showToast(`🎉 Khảo sát đã gửi thành công và lưu vào Hàng đợi kiểm duyệt [Mã: ${newId}]!`);

  // Switch to admin view to demonstrate workflow if desired
  setTimeout(() => {
    switchView('admin');
  }, 1200);
}

// ===================================================================
// ADMIN SERVICE & APPROVAL QUEUE (IMAGE 2 & 3)
// ===================================================================
function updateQueueBadge() {
  const pendingCount = APP_DATA.adminQueue.filter(item => item.status === 'PENDING').length;
  const badge = document.getElementById('pendingQueueCount');
  const adminPendingStat = document.getElementById('adminPendingStat');
  const adminApprovedStat = document.getElementById('adminApprovedStat');
  const adminCardsStat = document.getElementById('adminCardsCountStat');

  if (badge) badge.textContent = pendingCount;
  if (adminPendingStat) adminPendingStat.textContent = pendingCount;
  if (adminApprovedStat) adminApprovedStat.textContent = APP_DATA.adminQueue.filter(item => item.status === 'APPROVED').length;
  if (adminCardsStat) adminCardsStat.textContent = APP_DATA.evidenceCards.length;
}

function renderAdminQueue() {
  const container = document.getElementById('adminQueueContainer');
  if (!container) return;

  container.innerHTML = APP_DATA.adminQueue.map(item => `
    <div class="queue-card-item">
      <div class="queue-header-meta">
        <div style="display: flex; gap: 6px; align-items: center;">
          <span style="font-weight: 700; color: #fff;">${item.id}</span>
          <span class="badge-country">${item.countryName}</span>
          <span class="badge-domain">${item.domainName}</span>
          <span style="color: var(--text-muted); font-size: 0.75rem;">• ${item.submittedAt}</span>
        </div>
        <span class="badge-status ${item.status === 'PENDING' ? 'badge-pending' : (item.status === 'APPROVED' ? 'badge-approved' : 'badge-rejected')}">
          ${item.status === 'PENDING' ? '⏳ Chờ duyệt' : (item.status === 'APPROVED' ? '✓ Đã phê duyệt' : '✕ Đã từ chối')}
        </span>
      </div>

      <div>
        <h4 style="font-size: 0.95rem; color: #fff; margin-bottom: 0.25rem;">${escapeHtml(item.title)}</h4>
        <p style="font-size: 0.85rem; color: var(--text-secondary);">${escapeHtml(item.experienceText)}</p>
        <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.35rem;">
          Người gửi: <em>${escapeHtml(item.submitter)}</em> | Thẩm định: <em>${escapeHtml(item.sourceCredibility)}</em>
        </div>
      </div>

      ${item.status === 'PENDING' ? `
        <div class="queue-actions">
          <button class="btn-reject" onclick="processQueueItem('${item.id}', 'REJECT')">
            ✕ Từ chối
          </button>
          <button class="btn-approve" onclick="processQueueItem('${item.id}', 'APPROVE')">
            ✓ Phê duyệt & Đẩy vào Kho Evidence Cards
          </button>
        </div>
      ` : ''}
    </div>
  `).join('');
}

function processQueueItem(itemId, action) {
  const item = APP_DATA.adminQueue.find(i => i.id === itemId);
  if (!item) return;

  if (action === 'APPROVE') {
    item.status = 'APPROVED';

    // Promote to new official Evidence Card (as defined in Architecture diagram Image 2 & 3)
    const newEvidenceCard = {
      id: `EVD-${item.country}-${(APP_DATA.evidenceCards.length + 1).toString().padStart(3, '0')}`,
      country: item.country,
      countryName: item.countryName,
      domainId: item.domainId,
      domainName: item.domainName,
      title: item.title,
      context: `Kinh nghiệm thực tiễn từ cộng đồng người Việt tại ${item.countryName}.`,
      verifiedContent: item.experienceText,
      safeAction: item.proposedCard ? item.proposedCard.safeAction : item.experienceText,
      donots: item.proposedCard ? item.proposedCard.donots : 'Tránh vi phạm quy định cơ quan sở tại.',
      organization: 'Khảo sát cộng đồng Asteria AISC (Đã thẩm định)',
      sourceType: 'Dữ liệu cộng đồng kiểm chuẩn',
      sourceUrl: '#',
      reliabilityScore: 92,
      confidenceLevel: 'Đã xác minh (92%)',
      publishedDate: new Date().toISOString().split('T')[0],
      verifiedDate: new Date().toISOString().split('T')[0],
      status: 'APPROVED'
    };

    APP_DATA.evidenceCards.unshift(newEvidenceCard);
    renderEvidenceCards();
    showToast(`✓ Đã duyệt "${item.title}" và tạo thành công Evidence Card ${newEvidenceCard.id}!`);
  } else {
    item.status = 'REJECTED';
    showToast(`✕ Đã từ chối mục ${item.id}.`);
  }

  updateQueueBadge();
  renderAdminQueue();
}

// ===================================================================
// DATA-DRIVEN DASHBOARD SUB-TABS & FILTERS (TRANG 22, 23, 24)
// ===================================================================
function switchDashboardTab(tabId) {
  activeDashboardTab = tabId;

  // Toggle buttons
  document.querySelectorAll('.dash-tab-btn').forEach(btn => btn.classList.remove('active'));
  const btn = document.getElementById(`btn-dash-${tabId}`);
  if (btn) btn.classList.add('active');

  // Toggle panels
  document.querySelectorAll('.dash-subpanel').forEach(p => p.style.display = 'none');
  const panel = document.getElementById(`dash-panel-${tabId}`);
  if (panel) panel.style.display = 'block';
}

function updateDashboardFilters() {
  const country = document.getElementById('dashFilterCountry').value;
  const exp = document.getElementById('dashFilterExperience').value;
  const purpose = document.getElementById('dashFilterPurpose').value;

  showToast(`Đã áp dụng bộ lọc Dashboard: [Quốc gia: ${country}] [Kinh nghiệm: ${exp}]`);
}

// ===================================================================
// MODAL CONTROLS & UTILITIES
// ===================================================================
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

function openInfoModal() {
  const modal = document.getElementById('projectInfoModal');
  if (modal) modal.classList.add('active');
}

function openProfileModal() {
  switchView('chat');
  const selector = document.getElementById('chatUserCountry');
  if (selector) selector.focus();
  showToast('Bạn có thể tùy chỉnh Quốc gia, Mục đích và Giai đoạn tại cột bên trái!');
}

function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
    <span>${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
