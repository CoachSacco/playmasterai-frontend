function detectPlatform(link) {
  if (link.includes('drive.google.com')) return 'Google Drive';
  if (link.includes('hudl.com')) return 'Hudl';
  if (link.includes('dropbox.com')) return 'Dropbox';
  if (link.includes('nfhsnetwork.com')) return 'NFHS Network';
  if (link.includes('justplay.com')) return 'Just Play';
  if (link.includes('dvssport.com')) return 'DVSport';
  return 'Unknown Source';
}

function generateMockAnalysis(labelOrName, source = 'Unknown') {
  const platforms = {
    'Google Drive': {
      tendencies: 'Likes to spread the field on early downs. Uses motion to identify coverage.',
      adjustments: 'Try zone blitzes to disguise intentions. Mix man-zone coverages.',
      spotlight: 'RB #22 finds soft spots in coverage. FS #5 overcommits on play action.'
    },
    'Hudl': {
      tendencies: 'Heavy on trips formations. Loves quick outs and slants.',
      adjustments: 'Use press coverage on inside routes. Spy the mobile QB.',
      spotlight: 'WR #1 has explosive first steps. DE #9 dominates the edge.'
    },
    'Dropbox': {
      tendencies: 'Frequently runs inside zone. RPOs on 2nd & medium.',
      adjustments: 'Linebackers must key the QB. Drop safeties into shallow zones.',
      spotlight: 'QB #4 is dangerous on the run. MLB #42 leads in solo tackles.'
    },
    'NFHS Network': {
      tendencies: 'Relies on strong-side toss plays. Lots of 2-TE sets.',
      adjustments: 'Shift DL pre-snap. Jam tight ends at the line.',
      spotlight: 'TE #88 is a reliable target. CB #12 plays physical.'
    },
    'Just Play': {
      tendencies: 'Stacked formations to create mismatch lanes. Quick reads.',
      adjustments: 'Disrupt timing with press. Show blitz, drop into coverage.',
      spotlight: 'QB #6 reads fast. Safety #3 bites on fakes.'
    },
    'DVSport': {
      tendencies: 'Mixes in trick plays. Watch for reverses and jet sweeps.',
      adjustments: 'Discipline and edge contain. Maintain backside pursuit.',
      spotlight: 'WR #11 has gadget play speed. LB #33 fills gaps fast.'
    },
    'Unknown Source': {
      tendencies: 'Balanced offense. Mix of gap and zone schemes.',
      adjustments: 'Match personnel. Watch shifts and motions.',
      spotlight: 'RB #7 has great vision. DT #99 controls the middle.'
    }
  };

  return platforms[source] || platforms['Unknown Source'];
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

  function startAnalysis(analyzeBtn, statusSpan, labelOrName, sourceType) {
    analyzeBtn.disabled = true;
    statusSpan.textContent = ' ⏳ Analyzing formations...';

    setTimeout(() => {
      statusSpan.textContent = ' ⏳ Reading tendencies...';
      setTimeout(() => {
        statusSpan.textContent = ' ⏳ Generating report...';
        setTimeout(() => {
          const results = generateMockAnalysis(labelOrName, sourceType);
          fillAnalysisPage(results);
          statusSpan.textContent = ' ✅ Analysis Ready';
          analyzeBtn.style.display = 'none';
          setTimeout(() => toggleView('analysis'), 1000);
        }, 1500);
      }, 1500);
    }, 1500);
  }

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
      startAnalysis(analyzeBtn, statusSpan, label || link, platform)
    );

    return;
  }

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
      startAnalysis(analyzeBtn, statusSpan, label || file.name, 'Unknown Source')
    );

    status.textContent = `${isZip ? 'Zip' : 'Clip'} "${file.name}" uploaded (${label || 'No label'}). Ready for analysis.`;
  }
}

function fillAnalysisPage(data) {
  const textOutput = document.querySelector(".text-output");
  const chart = document.querySelector(".chart p");
  const diagram = document.querySelector(".formation-diagram p");
  const tagsTable = document.querySelector(".tags-table table");

  textOutput.innerHTML = `
    <h2>AI Breakdown</h2>
    <p><strong>Opponent Tendencies:</strong> ${data.tendencies}</p>
    <p><strong>Suggested Adjustments:</strong> ${data.adjustments}</p>
    <p><strong>Player Spotlight:</strong> ${data.spotlight}</p>
  `;

  chart.innerHTML = "[Simulated chart data: 72% success on PA passes, 48% on runs]";
  diagram.innerHTML = "[Top formations: Trips Right, Ace Bunch, I-Form Tight]";
  tagsTable.innerHTML = `
    <tr><th>Play</th><th>Coverage</th><th>Blitz</th></tr>
    <tr><td>3rd & 6</td><td>Cover 3</td><td>Weak Side</td></tr>
    <tr><td>2nd & 8</td><td>Man</td><td>Strong Side</td></tr>
    <tr><td>1st & 10</td><td>Zone</td><td>None</td></tr>
  `;
}
