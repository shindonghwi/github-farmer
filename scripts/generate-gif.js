const { createCanvas } = require('canvas');
const GIFEncoder = require('gifencoder');
const fs = require('fs');
const path = require('path');

// Constants
const CELL_SIZE = 12;
const CELL_GAP = 3;
const PADDING = 20;
const MOVE_INTERVAL = 60; // ms per frame

const CONTRIBUTION_COLORS = {
  0: '#161b22',
  1: '#0e4429',
  2: '#006d32',
  3: '#26a641',
  4: '#39d353',
};

function getColorLevel(count) {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 6) return 2;
  if (count <= 9) return 3;
  return 4;
}

async function fetchContributions(username, token) {
  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                weekday
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables: { username } }),
  });

  const data = await response.json();

  if (data.errors) {
    throw new Error(data.errors[0].message);
  }

  return data.data.user.contributionsCollection.contributionCalendar;
}

function gridToPixel(weekIndex, dayIndex, weekDays) {
  const yOffset = weekDays < 7 ? (7 - weekDays) : 0;
  return {
    x: PADDING + weekIndex * (CELL_SIZE + CELL_GAP) + CELL_SIZE / 2,
    y: PADDING + (dayIndex + yOffset) * (CELL_SIZE + CELL_GAP) + CELL_SIZE / 2,
  };
}

function drawFrame(ctx, contributions, state, canvasWidth, canvasHeight) {
  // Background
  ctx.fillStyle = '#0d1117';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Draw grid
  contributions.weeks.forEach((week, weekIndex) => {
    week.contributionDays.forEach((day, dayIndex) => {
      const weekDays = week.contributionDays.length;
      const pos = gridToPixel(weekIndex, dayIndex, weekDays);
      const cellKey = `${weekIndex}-${dayIndex}`;
      const isCollected = state.visitedCells.has(cellKey);

      if (isCollected) {
        if (state.isComplete && day.contributionCount > 0) {
          // Wave effect when complete
          const waveDelay = weekIndex * 100;
          const transitionTime = Math.max(0, state.completeFrame * MOVE_INTERVAL - waveDelay);
          const colorTransition = Math.min(1, transitionTime / 1000);

          if (colorTransition < 1) {
            ctx.fillStyle = '#30363d';
            ctx.globalAlpha = 0.7 * (1 - colorTransition);
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, CELL_SIZE / 2, 0, Math.PI * 2);
            ctx.fill();

            const level = getColorLevel(day.contributionCount);
            ctx.fillStyle = CONTRIBUTION_COLORS[level];
            ctx.globalAlpha = colorTransition * 0.6;
          } else {
            const wave = Math.sin(transitionTime * 0.0015) * 0.5 + 0.5;
            const level = getColorLevel(day.contributionCount);
            ctx.fillStyle = CONTRIBUTION_COLORS[level];
            ctx.globalAlpha = 0.4 + wave * 0.4;
          }
        } else {
          ctx.fillStyle = '#30363d';
          ctx.globalAlpha = 0.7;
        }
      } else {
        const level = getColorLevel(day.contributionCount);
        ctx.fillStyle = CONTRIBUTION_COLORS[level];
        ctx.globalAlpha = 1;
      }

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, CELL_SIZE / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });
  });

  // Draw arrow (if not complete or fading out)
  if (!state.isComplete || state.completeFrame < 12) {
    const currentWeek = contributions.weeks[Math.min(state.week, contributions.weeks.length - 1)];
    const weekDays = currentWeek ? currentWeek.contributionDays.length : 7;
    const charPos = gridToPixel(
      Math.min(state.week, contributions.weeks.length - 1),
      state.day,
      weekDays
    );

    ctx.save();
    ctx.translate(charPos.x, charPos.y);

    // Fade out when complete
    if (state.isComplete) {
      ctx.globalAlpha = Math.max(0, 1 - state.completeFrame / 12);
    }

    let rotation = 0;
    if (state.direction === 'down') rotation = Math.PI;
    else if (state.direction === 'up') rotation = 0;
    if (state.isTurning) rotation = Math.PI / 2;

    ctx.rotate(rotation);

    ctx.fillStyle = '#00fff5';
    ctx.beginPath();
    ctx.moveTo(0, -6);
    ctx.lineTo(5, 5);
    ctx.lineTo(0, 2);
    ctx.lineTo(-5, 5);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // Draw stats
  const gridEndY = PADDING + 7 * (CELL_SIZE + CELL_GAP);

  ctx.font = 'bold 12px monospace';
  ctx.fillStyle = '#39d353';
  ctx.fillText(`Contributions: ${state.displayedCount}`, PADDING, gridEndY + 16);

  ctx.font = '10px monospace';
  ctx.fillStyle = '#666';
  ctx.fillText(`Commits: ${state.commits}`, PADDING, gridEndY + 30);
  ctx.fillText(`PRs: ${state.pullRequests}`, PADDING + 100, gridEndY + 30);
  ctx.fillText(`Issues: ${state.issues}`, PADDING + 180, gridEndY + 30);
  ctx.fillText(`Reviews: ${state.reviews}`, PADDING + 260, gridEndY + 30);

  // Draw egg/chicks
  const rowY = gridEndY + 55;
  const startX = PADDING + 15;
  const spacing = 30;

  // Hatched chicks
  for (let i = 0; i < state.hatchedChicks; i++) {
    const chickX = startX + i * spacing;
    drawChick(ctx, chickX, rowY);
  }

  // Current egg
  const eggX = startX + state.hatchedChicks * spacing;
  const crackLevel = (state.displayedCount % 1000) / 1000;
  drawEgg(ctx, eggX, rowY, crackLevel);
}

function drawChick(ctx, x, y) {
  ctx.save();
  ctx.translate(x, y);

  // Body
  ctx.fillStyle = '#f9ca24';
  ctx.beginPath();
  ctx.ellipse(0, 3, 8, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Head
  ctx.beginPath();
  ctx.arc(0, -4, 6, 0, Math.PI * 2);
  ctx.fill();

  // Beak
  ctx.fillStyle = '#ff6b00';
  ctx.beginPath();
  ctx.moveTo(6, -4);
  ctx.lineTo(10, -3);
  ctx.lineTo(6, -2);
  ctx.closePath();
  ctx.fill();

  // Eye
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(3, -5, 1.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawEgg(ctx, x, y, crackLevel) {
  ctx.save();
  ctx.translate(x, y);

  // Egg body
  ctx.fillStyle = '#f5f5dc';
  ctx.beginPath();
  ctx.ellipse(0, 0, 10, 13, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cracks
  if (crackLevel > 0.1) {
    ctx.strokeStyle = '#8b7355';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-1, -8);
    ctx.lineTo(0, -3);
    ctx.lineTo(3, -5);
    ctx.stroke();
  }

  if (crackLevel > 0.5) {
    ctx.beginPath();
    ctx.moveTo(-5, -2);
    ctx.lineTo(-3, 3);
    ctx.lineTo(-6, 8);
    ctx.stroke();
  }

  ctx.restore();

  // Progress bar
  ctx.fillStyle = '#333';
  ctx.fillRect(x - 18, y + 18, 36, 3);
  ctx.fillStyle = crackLevel > 0.7 ? '#f9ca24' : '#39d353';
  ctx.fillRect(x - 18, y + 18, 36 * crackLevel, 3);
}

function simulateGame(contributions) {
  const weeks = contributions.weeks;
  const totalContributions = contributions.totalContributions;

  const state = {
    week: 0,
    day: 0,
    direction: 'down',
    isTurning: false,
    visitedCells: new Set(),
    collectedCount: 0,
    displayedCount: 0,
    isComplete: false,
    completeFrame: 0,
    commits: 0,
    pullRequests: 0,
    issues: 0,
    reviews: 0,
    hatchedChicks: 0,
  };

  const frames = [];
  let frameCount = 0;
  const maxFrames = 3000; // Safety limit

  while (frameCount < maxFrames) {
    // Record frame every few iterations for smoother GIF
    if (frameCount % 2 === 0) {
      frames.push({ ...state, visitedCells: new Set(state.visitedCells) });
    }

    // Update displayed count
    if (state.displayedCount < state.collectedCount) {
      state.displayedCount = Math.min(state.displayedCount + 4, state.collectedCount);
    }

    // Update hatched chicks
    const newChicks = Math.floor(state.displayedCount / 1000);
    if (newChicks > state.hatchedChicks) {
      state.hatchedChicks = newChicks;
    }

    // If complete, continue for wave animation
    if (state.isComplete) {
      state.completeFrame++;
      if (state.completeFrame > 120) break; // End after wave animation
      frameCount++;
      continue;
    }

    // Collect current cell
    const cellKey = `${state.week}-${state.day}`;
    if (!state.visitedCells.has(cellKey)) {
      const week = weeks[state.week];
      if (week) {
        const day = week.contributionDays[state.day];
        if (day && day.contributionCount > 0) {
          state.collectedCount += day.contributionCount;
          state.commits += Math.floor(day.contributionCount * 0.6);
          state.pullRequests += Math.floor(day.contributionCount * 0.2);
          state.issues += Math.floor(day.contributionCount * 0.1);
          state.reviews += Math.floor(day.contributionCount * 0.1);
        }
      }
      state.visitedCells.add(cellKey);
    }

    // Move
    if (state.isTurning) {
      state.isTurning = false;
      state.week++;

      if (state.week >= weeks.length) {
        state.isComplete = true;
      } else {
        const newWeekDays = weeks[state.week].contributionDays.length;
        if (state.direction === 'down') {
          state.day = 0;
        } else {
          state.day = newWeekDays - 1;
        }
      }
    } else {
      const currentWeekDays = weeks[state.week]?.contributionDays.length || 7;

      if (state.direction === 'down') {
        if (state.day < currentWeekDays - 1) {
          state.day++;
        } else {
          state.direction = 'up';
          state.isTurning = true;
        }
      } else {
        if (state.day > 0) {
          state.day--;
        } else {
          state.direction = 'down';
          state.isTurning = true;
        }
      }
    }

    frameCount++;
  }

  return frames;
}

async function generateGIF(username, token, outputPath) {
  console.log(`Fetching contributions for ${username}...`);
  const contributions = await fetchContributions(username, token);

  console.log(`Total contributions: ${contributions.totalContributions}`);
  console.log(`Weeks: ${contributions.weeks.length}`);

  const canvasWidth = PADDING * 2 + contributions.weeks.length * (CELL_SIZE + CELL_GAP);
  const canvasHeight = PADDING * 2 + 7 * (CELL_SIZE + CELL_GAP) + 80;

  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext('2d');

  const encoder = new GIFEncoder(canvasWidth, canvasHeight);

  const outputDir = path.dirname(outputPath);
  if (outputDir && !fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const stream = fs.createWriteStream(outputPath);
  encoder.createReadStream().pipe(stream);

  encoder.start();
  encoder.setRepeat(-1); // No repeat - play once
  encoder.setDelay(MOVE_INTERVAL);
  encoder.setQuality(10);

  console.log('Simulating game...');
  const frames = simulateGame(contributions);

  console.log(`Rendering ${frames.length} frames...`);
  for (let i = 0; i < frames.length; i++) {
    drawFrame(ctx, contributions, frames[i], canvasWidth, canvasHeight);

    // Last frame: hold for 10 seconds
    if (i === frames.length - 1) {
      encoder.setDelay(10000);
    }

    encoder.addFrame(ctx);

    if (i % 50 === 0) {
      console.log(`Progress: ${Math.round(i / frames.length * 100)}%`);
    }
  }

  encoder.finish();

  return new Promise((resolve) => {
    stream.on('finish', () => {
      console.log(`GIF saved to ${outputPath}`);
      resolve();
    });
  });
}

// Main execution
const username = process.argv[2] || process.env.INPUT_USERNAME || process.env.GITHUB_REPOSITORY_OWNER;
const token = process.env.GITHUB_TOKEN || process.env.INPUT_GITHUB_TOKEN;
const outputPath = process.argv[3] || process.env.INPUT_OUTPUT_PATH || 'github-farmer.gif';

if (!username) {
  console.error('Error: Username is required');
  process.exit(1);
}

if (!token) {
  console.error('Error: GITHUB_TOKEN is required');
  process.exit(1);
}

generateGIF(username, token, outputPath)
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error:', err.message);
    process.exit(1);
  });
