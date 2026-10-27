/**
 * ============================================================================
 * NUMBER QUEST KIDS — FUN MATH & NUMBER ARCADE
 * Pure Vanilla JavaScript Game Engine & Web Audio Procedural Synthesizer
 * ============================================================================
 */

(function () {
  'use strict';

  // --- GAME CONSTANTS & CONFIGURATION ---
  const STORAGE_KEY_BEST = 'gamility_number_quest_best';
  const MAX_ATTEMPTS = 3;

  // Number to English Words Converter (1 to 10,000)
  function numberToWords(num) {
    const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
      'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    if (num === 0) return 'zero';
    if (num < 20) return ones[num];
    if (num < 100) {
      const rem = num % 10;
      return tens[Math.floor(num / 10)] + (rem > 0 ? '-' + ones[rem] : '');
    }
    if (num < 1000) {
      const rem = num % 100;
      return ones[Math.floor(num / 100)] + ' hundred' + (rem > 0 ? ' ' + numberToWords(rem) : '');
    }
    if (num <= 10000) {
      const thousands = Math.floor(num / 1000);
      const rem = num % 1000;
      return numberToWords(thousands) + ' thousand' + (rem > 0 ? ' ' + numberToWords(rem) : '');
    }
    return num.toLocaleString();
  }

  // --- AUDIO SYNTHESIZER (Web Audio API) ---
  class SoundController {
    constructor() {
      this.ctx = null;
      this.soundEnabled = true;
    }

    init() {
      if (this.ctx) return;
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }

    resume() {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggle() {
      this.soundEnabled = !this.soundEnabled;
      return this.soundEnabled;
    }

    // Warm Wooden Block Tap
    playCardClick() {
      if (!this.soundEnabled || !this.ctx) return;
      try {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(450, t);
        osc.frequency.exponentialRampToValueAtTime(150, t + 0.05);

        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.05);
      } catch (e) {}
    }

    // Cheerful Slot Snap Clink
    playSnap() {
      if (!this.soundEnabled || !this.ctx) return;
      try {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, t);
        osc.frequency.exponentialRampToValueAtTime(1320, t + 0.08);

        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.09);
      } catch (e) {}
    }

    // Gentle "Uh-Oh" Wobble
    playOops() {
      if (!this.soundEnabled || !this.ctx) return;
      try {
        const t = this.ctx.currentTime;
        const freqs = [330, 260];
        freqs.forEach((f, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, t + idx * 0.12);
          gain.gain.setValueAtTime(0.25, t + idx * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.12 + 0.16);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t + idx * 0.12);
          osc.stop(t + idx * 0.12 + 0.17);
        });
      } catch (e) {}
    }

    // Answer Reveal Chime
    playReveal() {
      if (!this.soundEnabled || !this.ctx) return;
      try {
        const t = this.ctx.currentTime;
        const freqs = [523.25, 659.25, 783.99]; // C5, E5, G5
        freqs.forEach((f, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, t + idx * 0.1);
          gain.gain.setValueAtTime(0.25, t + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.1 + 0.4);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t + idx * 0.1);
          osc.stop(t + idx * 0.1 + 0.41);
        });
      } catch (e) {}
    }

    // Victory Fanfare & Sparkly Arpeggios
    playVictory() {
      if (!this.soundEnabled || !this.ctx) return;
      try {
        const t = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
        notes.forEach((f, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, t + idx * 0.08);
          gain.gain.setValueAtTime(0.3, t + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.35);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t + idx * 0.08);
          osc.stop(t + idx * 0.08 + 0.36);
        });
      } catch (e) {}
    }
  }

  // --- GAME ENGINE ---
  class NumberQuestGame {
    constructor() {
      // DOM Elements
      this.viewport = document.getElementById('gameViewport');
      this.btnModeWords = document.getElementById('btnModeWords');
      this.btnModeSequence = document.getElementById('btnModeSequence');
      this.btnModeSkip = document.getElementById('btnModeSkip');
      this.btnTier1 = document.getElementById('btnTier1');
      this.btnTier2 = document.getElementById('btnTier2');
      this.btnTier3 = document.getElementById('btnTier3');
      this.btnToggleAudio = document.getElementById('btnToggleAudio');
      this.audioIcon = document.getElementById('audioIcon');

      // Stats Elements
      this.starsContainer = document.getElementById('starsContainer');
      this.hudScore = document.getElementById('hudScore');
      this.hudStreakBadge = document.getElementById('hudStreakBadge');
      this.hudBestScore = document.getElementById('hudBestScore');

      // Stage Elements
      this.challengeCard = document.getElementById('challengeCard');
      this.mascotBadge = document.getElementById('mascotBadge');
      this.challengeCategory = document.getElementById('challengeCategory');
      this.challengePrompt = document.getElementById('challengePrompt');
      this.numberSlotsRow = document.getElementById('numberSlotsRow');
      this.feedbackText = document.getElementById('feedbackText');
      this.woodenDeckShelf = document.getElementById('woodenDeckShelf');
      this.deckCardsWrapper = document.getElementById('deckCardsWrapper');
      this.fxOverlay = document.getElementById('fxOverlay');

      // Modals
      this.startOverlay = document.getElementById('startOverlay');
      this.gameOverOverlay = document.getElementById('gameOverOverlay');
      this.btnStartGame = document.getElementById('btnStartGame');
      this.btnPlayAgain = document.getElementById('btnPlayAgain');
      this.modalSelectWords = document.getElementById('modalSelectWords');
      this.modalSelectSequence = document.getElementById('modalSelectSequence');

      // Game Over Stats
      this.goFinalScore = document.getElementById('goFinalScore');
      this.goBestScore = document.getElementById('goBestScore');
      this.goPuzzlesSolved = document.getElementById('goPuzzlesSolved');
      this.goMaxStreak = document.getElementById('goMaxStreak');
      this.goStarsEarned = document.getElementById('goStarsEarned');

      // Audio Controller
      this.audio = new SoundController();

      // State
      this.currentMode = 'words'; // 'words' | 'sequence' | 'skip'
      this.currentTier = 1; // 1: (1-20), 2: (1-100), 3: (100-10,000)
      this.score = 0;
      this.bestScore = 0;
      this.streak = 0;
      this.maxStreak = 0;
      this.puzzlesSolved = 0;
      this.totalStarsEarned = 0;
      this.attemptsLeft = MAX_ATTEMPTS;

      // Active Puzzle Data
      this.activePuzzle = null;
      this.isChecking = false;
      this.nextPuzzleTimeout = null;
      this.mistakeTimeout = null;

      this.loadBestScore();
      this.bindEvents();
    }

    loadBestScore() {
      try {
        const val = localStorage.getItem(STORAGE_KEY_BEST);
        this.bestScore = val ? parseInt(val, 10) || 0 : 0;
        this.hudBestScore.textContent = this.bestScore.toLocaleString();
      } catch (e) {
        this.bestScore = 0;
      }
    }

    saveBestScore() {
      if (this.score > this.bestScore) {
        this.bestScore = this.score;
        try {
          localStorage.setItem(STORAGE_KEY_BEST, this.bestScore.toString());
        } catch (e) {}
        this.hudBestScore.textContent = this.bestScore.toLocaleString();
      }
    }

    bindEvents() {
      // Audio toggle
      this.btnToggleAudio.addEventListener('click', (e) => {
        e.stopPropagation();
        this.audio.init();
        const enabled = this.audio.toggle();
        this.audioIcon.textContent = enabled ? '🔊' : '🔇';
      });

      // Start modal actions
      this.modalSelectWords.addEventListener('click', () => {
        this.modalSelectWords.classList.add('active');
        this.modalSelectSequence.classList.remove('active');
        this.currentMode = 'words';
      });
      this.modalSelectSequence.addEventListener('click', () => {
        this.modalSelectSequence.classList.add('active');
        this.modalSelectWords.classList.remove('active');
        this.currentMode = 'sequence';
      });

      this.btnStartGame.addEventListener('click', () => {
        this.audio.init();
        this.audio.resume();
        this.startOverlay.style.display = 'none';
        this.updateModeUI();
        this.generateNewPuzzle();
      });

      this.btnPlayAgain.addEventListener('click', () => {
        this.gameOverOverlay.style.display = 'none';
        this.score = 0;
        this.streak = 0;
        this.puzzlesSolved = 0;
        this.hudScore.textContent = '0';
        this.hudStreakBadge.style.display = 'none';
        this.generateNewPuzzle();
      });

      // Mode Switchers in Top Bar
      this.btnModeWords.addEventListener('click', () => {
        this.audio.playCardClick();
        if (this.currentMode === 'words' && !this.isChecking) return;
        this.currentMode = 'words';
        this.updateModeUI();
        this.generateNewPuzzle();
      });

      this.btnModeSequence.addEventListener('click', () => {
        this.audio.playCardClick();
        if (this.currentMode === 'sequence' && !this.isChecking) return;
        this.currentMode = 'sequence';
        this.updateModeUI();
        this.generateNewPuzzle();
      });

      this.btnModeSkip.addEventListener('click', () => {
        this.audio.playCardClick();
        if (this.currentMode === 'skip' && !this.isChecking) return;
        this.currentMode = 'skip';
        this.updateModeUI();
        this.generateNewPuzzle();
      });

      // Tier Switchers: 1, 2, 3
      [this.btnTier1, this.btnTier2, this.btnTier3].forEach(btn => {
        btn.addEventListener('click', () => {
          this.audio.playCardClick();
          const tier = parseInt(btn.dataset.tier, 10);
          if (this.currentTier === tier && !this.isChecking) return;
          this.currentTier = tier;
          this.updateTierUI();
          this.generateNewPuzzle();
        });
      });
    }

    updateModeUI() {
      [this.btnModeWords, this.btnModeSequence, this.btnModeSkip].forEach(btn => {
        btn.classList.remove('active');
      });
      if (this.currentMode === 'words') this.btnModeWords.classList.add('active');
      else if (this.currentMode === 'sequence') this.btnModeSequence.classList.add('active');
      else if (this.currentMode === 'skip') this.btnModeSkip.classList.add('active');
    }

    updateTierUI() {
      [this.btnTier1, this.btnTier2, this.btnTier3].forEach(btn => {
        if (parseInt(btn.dataset.tier, 10) === this.currentTier) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }

    // --- ROBUST DISTRACTOR GENERATOR (Fail-Proof O(1) Execution) ---
    generateDistractors(targetNum, count = 3, minVal = 1, maxVal = 20, step = 1) {
      const optionSet = new Set([targetNum]);

      // 1. Structured nearby offsets (+step, -step, +2*step, etc.)
      const offsets = [
        step, -step,
        step * 2, -step * 2,
        step * 3, -step * 3,
        step * 5, -step * 5,
        step * 10, -step * 10
      ];

      for (const off of offsets) {
        const candidate = targetNum + off;
        if (candidate >= minVal && candidate <= maxVal && !optionSet.has(candidate)) {
          optionSet.add(candidate);
          if (optionSet.size >= count + 1) break;
        }
      }

      // 2. For Tier 3, try place-value digit transpositions (e.g. 5,290 -> 5,920)
      if (this.currentTier === 3 && optionSet.size < count + 1) {
        const str = targetNum.toString();
        if (str.length >= 3) {
          const arr = str.split('');
          [arr[1], arr[2]] = [arr[2], arr[1]];
          const swapped = parseInt(arr.join(''), 10);
          if (swapped >= minVal && swapped <= maxVal && !optionSet.has(swapped)) {
            optionSet.add(swapped);
          }
        }
      }

      // 3. Fallback: random numbers within range
      let safetyAttempts = 0;
      while (optionSet.size < count + 1 && safetyAttempts < 60) {
        safetyAttempts++;
        const rand = minVal + Math.floor(Math.random() * (maxVal - minVal + 1));
        if (rand > 0) {
          optionSet.add(rand);
        }
      }

      // 4. Absolute emergency fallback if range was narrower than count
      let emergencyVal = Math.max(...optionSet) + 1;
      while (optionSet.size < count + 1) {
        optionSet.add(emergencyVal++);
      }

      const arr = Array.from(optionSet);
      arr.sort(() => Math.random() - 0.5);
      return arr;
    }

    // --- PUZZLE GENERATION ---
    generateNewPuzzle() {
      // Clear any pending transitions immediately
      if (this.nextPuzzleTimeout) {
        clearTimeout(this.nextPuzzleTimeout);
        this.nextPuzzleTimeout = null;
      }
      if (this.mistakeTimeout) {
        clearTimeout(this.mistakeTimeout);
        this.mistakeTimeout = null;
      }

      this.isChecking = false;
      this.attemptsLeft = MAX_ATTEMPTS;
      this.updateStarsUI();
      this.updateModeUI();
      this.updateTierUI();

      if (this.currentMode === 'words') {
        this.generateWordsPuzzle();
      } else if (this.currentMode === 'sequence') {
        this.generateSequencePuzzle(false);
      } else {
        this.generateSequencePuzzle(true); // Skip counting
      }
    }

    // Mode 1: Words to Numbers (e.g. "five thousand two hundred ninety" ➔ 5,290)
    generateWordsPuzzle() {
      let targetNum = 0;
      let minVal = 1;
      let maxVal = 20;

      if (this.currentTier === 1) {
        minVal = 1;
        maxVal = 20;
        targetNum = 1 + Math.floor(Math.random() * 20); // 1 to 20
      } else if (this.currentTier === 2) {
        minVal = 21;
        maxVal = 100;
        targetNum = 21 + Math.floor(Math.random() * 80); // 21 to 100
      } else {
        minVal = 100;
        maxVal = 10000;
        // Hundreds & Thousands (e.g., 250, 1200, 5290, 8450)
        const roll = Math.random();
        if (roll < 0.4) {
          // Hundreds (100 - 990)
          targetNum = (1 + Math.floor(Math.random() * 9)) * 100 + Math.floor(Math.random() * 10) * 10;
        } else {
          // Thousands (1000 - 9999)
          const thousands = (1 + Math.floor(Math.random() * 9)) * 1000;
          const hundreds = Math.floor(Math.random() * 10) * 100;
          const tens = Math.floor(Math.random() * 10) * 10;
          targetNum = thousands + hundreds + tens + (Math.random() < 0.3 ? Math.floor(Math.random() * 9) : 0);
        }
      }

      const wordsPhrase = numberToWords(targetNum);

      this.mascotBadge.textContent = '🦉';
      this.challengeCategory.textContent = 'WORDS TO NUMBERS';
      this.challengePrompt.textContent = `"${wordsPhrase}"`;
      this.feedbackText.textContent = 'Choose the matching number below!';

      const step = this.currentTier === 1 ? 1 : (this.currentTier === 2 ? 10 : 100);
      const options = this.generateDistractors(targetNum, 3, minVal, maxVal, step);

      this.activePuzzle = {
        mode: 'words',
        targetNum: targetNum,
        options: options
      };

      this.renderWordsTargetSlot();
      this.renderDeckCards(options);
    }

    renderWordsTargetSlot() {
      this.numberSlotsRow.innerHTML = '';
      this.numberSlotsRow.dataset.mode = 'words';

      const slot = document.createElement('div');
      slot.className = 'number-slot-block slot-empty';
      slot.id = 'targetNumberSlot';
      slot.textContent = '?';
      this.numberSlotsRow.appendChild(slot);
    }

    // Mode 2 & 3: Missing Sequence (12, 13, ?, 15) & Skip Counting (10, 20, ?, 40)
    generateSequencePuzzle(isSkipCount = false) {
      let step = 1;
      let startNum = 1;
      let minVal = 1;
      let maxVal = 20;

      if (!isSkipCount) {
        // Missing Number Sequence (consecutive step = 1)
        step = 1;
        if (this.currentTier === 1) {
          minVal = 1;
          maxVal = 20;
          startNum = 1 + Math.floor(Math.random() * 16); // 1 to 16 -> sequence 1..19
        } else if (this.currentTier === 2) {
          minVal = 21;
          maxVal = 100;
          startNum = 21 + Math.floor(Math.random() * 75); // 21 to 95 -> sequence 21..98
        } else {
          minVal = 100;
          maxVal = 10000;
          startNum = (1 + Math.floor(Math.random() * 8)) * 1000 + Math.floor(Math.random() * 900);
        }
      } else {
        // Skip Counting
        if (this.currentTier === 1) {
          step = 2;
          minVal = 2;
          maxVal = 20;
          startNum = (1 + Math.floor(Math.random() * 6)) * 2; // 2, 4, 6... sequence up to 18
        } else if (this.currentTier === 2) {
          step = Math.random() < 0.5 ? 5 : 10;
          minVal = 20;
          maxVal = 100;
          const maxSteps = step === 5 ? 13 : 6;
          startNum = 20 + Math.floor(Math.random() * maxSteps) * step; // e.g. 20, 25, 30... or 20, 30...
        } else {
          step = Math.random() < 0.5 ? 100 : 500;
          minVal = 100;
          maxVal = 10000;
          startNum = (1 + Math.floor(Math.random() * 8)) * 1000 + Math.floor(Math.random() * 4) * step;
        }
      }

      const sequence = [
        startNum,
        startNum + step,
        startNum + step * 2,
        startNum + step * 3
      ];

      // Missing index (either index 1 or 2 so there's always surrounding context)
      const missingIdx = Math.random() < 0.5 ? 1 : 2;
      const targetNum = sequence[missingIdx];

      this.mascotBadge.textContent = isSkipCount ? '⚡' : '🔢';
      this.challengeCategory.textContent = isSkipCount ? `SKIP COUNTING (BY ${step}s)` : 'MISSING NUMBER SEQUENCE';
      this.challengePrompt.textContent = isSkipCount
        ? `Count by ${step}s! What number comes next?`
        : 'Find the missing number in the train!';
      this.feedbackText.textContent = 'Pick the missing number block!';

      const distractorMin = Math.max(minVal, targetNum - step * 5);
      const distractorMax = Math.min(maxVal, targetNum + step * 5);
      const options = this.generateDistractors(targetNum, 3, distractorMin, distractorMax, step);

      this.activePuzzle = {
        mode: isSkipCount ? 'skip' : 'sequence',
        sequence: sequence,
        missingIdx: missingIdx,
        targetNum: targetNum,
        options: options
      };

      this.renderSequenceSlots(sequence, missingIdx);
      this.renderDeckCards(options);
    }

    renderSequenceSlots(sequence, missingIdx) {
      this.numberSlotsRow.innerHTML = '';
      this.numberSlotsRow.dataset.mode = 'sequence';

      sequence.forEach((num, idx) => {
        const slot = document.createElement('div');
        slot.className = 'number-slot-block';

        if (idx === missingIdx) {
          slot.classList.add('slot-empty');
          slot.id = 'targetNumberSlot';
          slot.textContent = '?';
        } else {
          slot.classList.add('slot-filled-preset');
          slot.textContent = num.toLocaleString();
        }

        this.numberSlotsRow.appendChild(slot);
      });
    }

    renderDeckCards(options) {
      this.deckCardsWrapper.innerHTML = '';

      options.forEach(num => {
        const card = document.createElement('div');
        card.className = 'deck-number-card';
        if (num >= 1000) card.classList.add('large-digits');
        card.textContent = num.toLocaleString();
        card.dataset.num = num.toString();

        card.addEventListener('click', () => this.handleAnswerSelect(num, card));
        this.deckCardsWrapper.appendChild(card);
      });
    }

    // --- ANSWER SELECTION & VALIDATION ---
    handleAnswerSelect(selectedNum, card) {
      if (this.isChecking) return;
      this.audio.playCardClick();

      const isCorrect = (selectedNum === this.activePuzzle.targetNum);

      if (isCorrect) {
        this.handleSuccess(selectedNum);
      } else {
        this.handleMistake(selectedNum);
      }
    }

    handleSuccess(num) {
      this.isChecking = true;
      this.audio.playVictory();
      this.spawnConfetti();

      const targetSlot = document.getElementById('targetNumberSlot');
      if (targetSlot) {
        targetSlot.classList.remove('slot-empty', 'slot-wrong');
        targetSlot.classList.add('slot-correct');
        targetSlot.textContent = num.toLocaleString();
      }

      this.streak++;
      if (this.streak > this.maxStreak) this.maxStreak = this.streak;
      this.puzzlesSolved++;
      this.totalStarsEarned += this.attemptsLeft;

      const basePts = this.currentTier === 1 ? 100 : (this.currentTier === 2 ? 200 : 350);
      const earnedPts = basePts * this.attemptsLeft;
      this.score += earnedPts;
      this.saveBestScore();

      this.hudScore.textContent = this.score.toLocaleString();
      if (this.streak > 1) {
        this.hudStreakBadge.textContent = `${this.streak}🔥`;
        this.hudStreakBadge.style.display = 'inline-block';
      }

      this.feedbackText.textContent = `🌟 Correct! +${earnedPts} points! 🌟`;

      if (this.nextPuzzleTimeout) clearTimeout(this.nextPuzzleTimeout);
      this.nextPuzzleTimeout = setTimeout(() => {
        this.generateNewPuzzle();
      }, 1200);
    }

    handleMistake(wrongNum) {
      this.audio.playOops();
      this.attemptsLeft--;
      this.updateStarsUI();

      const targetSlot = document.getElementById('targetNumberSlot');
      if (targetSlot) {
        targetSlot.classList.remove('slot-empty');
        targetSlot.classList.add('slot-wrong');
        targetSlot.textContent = wrongNum.toLocaleString();
      }

      if (this.attemptsLeft > 0) {
        this.feedbackText.textContent = `Oops! Try again (${this.attemptsLeft} ⭐ left!)`;

        if (this.mistakeTimeout) clearTimeout(this.mistakeTimeout);
        this.mistakeTimeout = setTimeout(() => {
          if (targetSlot) {
            targetSlot.classList.remove('slot-wrong');
            targetSlot.classList.add('slot-empty');
            targetSlot.textContent = '?';
          }
          this.isChecking = false;
        }, 650);
      } else {
        // 3 failed attempts: Gently reveal correct answer for learning!
        this.isChecking = true;
        this.streak = 0;
        this.hudStreakBadge.style.display = 'none';
        this.feedbackText.textContent = `💡 The answer is ${this.activePuzzle.targetNum.toLocaleString()}! Great try! ✨`;
        this.audio.playReveal();

        if (targetSlot) {
          targetSlot.classList.remove('slot-empty', 'slot-wrong');
          targetSlot.classList.add('slot-revealed');
          targetSlot.textContent = this.activePuzzle.targetNum.toLocaleString();
        }

        if (this.nextPuzzleTimeout) clearTimeout(this.nextPuzzleTimeout);
        this.nextPuzzleTimeout = setTimeout(() => {
          this.generateNewPuzzle();
        }, 2000);
      }
    }

    updateStarsUI() {
      const stars = [
        document.getElementById('star1'),
        document.getElementById('star2'),
        document.getElementById('star3')
      ];
      stars.forEach((s, idx) => {
        if (idx < this.attemptsLeft) {
          s.classList.add('active');
          s.classList.remove('lost');
        } else {
          s.classList.remove('active');
          s.classList.add('lost');
        }
      });
    }

    spawnConfetti() {
      const colors = ['#10b981', '#059669', '#f59e0b', '#0284c7', '#8b5cf6', '#ec4899'];
      for (let i = 0; i < 24; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        piece.style.left = `${15 + Math.random() * 70}%`;
        piece.style.top = `${40 + Math.random() * 20}%`;

        const angle = Math.random() * Math.PI * 2;
        const dist = 50 + Math.random() * 90;
        piece.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
        piece.style.setProperty('--ty', `${Math.sin(angle) * dist - 30}px`);

        this.fxOverlay.appendChild(piece);
        setTimeout(() => piece.remove(), 1200);
      }
    }
  }

  // Boot on DOM ready
  window.addEventListener('DOMContentLoaded', () => {
    window.gamilityNumberQuest = new NumberQuestGame();
  });

})();
