function detectPlatform(link) {
  if (link.includes('drive.google.com')) return 'Google Drive';
  if (link.includes('hudl.com')) return 'Hudl';
  if (link.includes('dropbox.com')) return 'Dropbox';
  if (link.includes('nfhsnetwork.com')) return 'NFHS Network';
  if (link.includes('justplay.com')) return 'Just Play';
  if (link.includes('dvssport.com')) return 'DVSport';
  return 'Unknown Source';
}

function handleSubmit() {
  const link = document.getElementById('videoLink').value.trim();
  const file = document.getElementById('fileUpload').files[0];
  const label = document.getElementById('clipLabel').value.trim();
  const status = document.getElementById('status');
  const uploadItems = document.getElementById('uploadItems');

  if (!link && !file) {
    status.textContent = "Please paste a link or upload a file.";
    return;
  }

  function startAnalysis(analyzeBtn, statusSpan, labelOrName, linkOrFile) {
    analyzeBtn.disabled = true;
    statusSpan.textContent = ' ⏳ Analyzing formations';

    setTimeout(() => {
      statusSpan.textContent = ' ⏳ Reading tendencies';
      setTimeout(() => {
        statusSpan.textContent = ' ⏳ Generating report';
        setTimeout(() => {
          const results = runThePlayMaster(linkOrFile, labelOrName);
          fillAnalysisPage(results);
          statusSpan.textContent = ' ✅ Analysis Ready by The PlayMaster';
          analyzeBtn.style.display = 'none';
          setTimeout(() => toggleView('analysis'), 1000);
        }, 2000);
      }, 2000);
    }, 2000);
  }

  // Handle LINK upload
  if (link) {
    const platform = detectPlatform(link);
    status.textContent = `${platform} link received (${label || 'No label'}). Ready for analysis.`;

    const newItem = document.createElement('li');
    newItem.innerHTML = `
      <span>🔗 ${platform} (${label || 'Link'}): ${link}</span>
      <button class="analyze-btn">Analyze</button>
      <span class="analysis-status"></span>
    `;
    uploadItems.appendChild(newItem);

    const analyzeBtn = newItem.querySelector('.analyze-btn');
    const statusSpan = newItem.querySelector('.analysis-status');

    analyzeBtn.addEventListener('click', () =>
      startAnalysis(analyzeBtn, statusSpan, label || link, link)
    );

    return;
  }

  // Handle FILE upload
  if (file) {
    const fileName = file.name.toLowerCase();
    const isZip = fileName.endsWith(".zip");

    const newItem = document.createElement('li');
    newItem.innerHTML = `
      <span>${isZip ? '📦' : '🎥'} ${label || file.name}</span>
      <button class="analyze-btn">Analyze</button>
      <span class="analysis-status"></span>
    `;
    uploadItems.appendChild(newItem);

    const analyzeBtn = newItem.querySelector('.analyze-btn');
    const statusSpan = newItem.querySelector('.analysis-status');

    analyzeBtn.addEventListener('click', () =>
      startAnalysis(analyzeBtn, statusSpan, label || file.name, file.name)
    );

    if (isZip) {
      status.textContent = `Zip file "${file.name}" uploaded (${label || 'No label'}). Auto-extraction and processing will be available soon.`;
    } else {
      status.textContent = `Clip "${file.name}" uploaded (${label || 'No label'}). Ready for analysis.`;
    }
  }
}

