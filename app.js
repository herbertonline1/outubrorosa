document.addEventListener('DOMContentLoaded', () => {

 /* -------------------------------------------------------------
 * 1. TEMA ESCURO / CLARO (PADRÃO: MODO CLARO)
 * ------------------------------------------------------------- */
const themeToggle = document.getElementById('themeToggle');

// Define o tema padrão como 'light' se a preferência ainda não estiver salva no localStorage
if (!localStorage.getItem('theme')) {
  localStorage.setItem('theme', 'light');
}

// Aplica a classe 'dark' APENAS se o usuário explicitamente salvou 'dark' no localStorage
if (localStorage.getItem('theme') === 'dark') {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

const toggleTheme = () => {
  if (document.documentElement.classList.contains('dark')) {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  } else {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }
};

if (themeToggle) {
  themeToggle.addEventListener('click', toggleTheme);
}

/* -------------------------------------------------------------
 * 2. MENU MOBILE (TRANSIÇÃO SUAVE)
 * ------------------------------------------------------------- */
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

if (menuBtn && mobileMenu) {
  const toggleMenu = (forceClose = false) => {
    const isOpen = mobileMenu.classList.contains('max-h-96');

    if (isOpen || forceClose) {
      // Fecha o menu suavemente
      mobileMenu.classList.remove('max-h-96', 'opacity-100');
      mobileMenu.classList.add('max-h-0', 'opacity-0');
    } else {
      // Abre o menu suavemente
      mobileMenu.classList.remove('max-h-0', 'opacity-0');
      mobileMenu.classList.add('max-h-96', 'opacity-100');
    }
  };

  menuBtn.addEventListener('click', () => toggleMenu());

  // Fecha o menu ao clicar em qualquer link interno
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(true));
  });
}

  /* -------------------------------------------------------------
   * 3. CARROSSEL DA AUTOAVALIAÇÃO (COM TRANSIÇÃO SUAVE)
   * ------------------------------------------------------------- */
  const steps = [
    {
      title: "1. No Espelho: Observação Inicial",
      desc: "Fique em pé diante do espelho com os braços relaxados ao lado do corpo. Observe com calma o formato, contorno, cor e textura da pele das mamas. Lembre-se: ter pequenas diferenças entre uma mama e outra é perfeitamente normal.",
      svg: `<svg viewBox="0 0 100 100" class="w-full h-full stroke-current fill-none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M25 90V40a25 25 0 0 1 50 0v50"/>
              <circle cx="50" cy="45" r="8"/>
              <path d="M35 80c2-12 8-18 15-18s13 6 15 18"/>
            </svg>`
    },
    {
      title: "2. Com os Braços Elevados",
      desc: "Levante os dois braços acima da cabeça e observe novamente. Note se a movimentação revela algum afundamento na pele, retração do mamilo, rugosidade ou alteração na superfície das mamas.",
      svg: `<svg viewBox="0 0 100 100" class="w-full h-full stroke-current fill-none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M25 90V40a25 25 0 0 1 50 0v50"/>
              <circle cx="50" cy="50" r="7"/>
              <path d="M50 57v20M50 62L36 40M50 62l14-22"/>
            </svg>`
    },
    {
      title: "3. Palpação Cuidadosa",
      desc: "No banho ou deitada, eleve um dos braços atrás da cabeça. Com as pontas dos três dedos centrais da outra mão, faça pequenos movimentos circulares por toda a mama e siga até a região da axila, com pressão leve e moderada.",
      svg: `<svg viewBox="0 0 100 100" class="w-full h-full stroke-current fill-none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="50" cy="50" r="30"/>
              <circle cx="50" cy="50" r="18"/>
              <circle cx="50" cy="50" r="5" fill="currentColor"/>
              <path d="M72 18c6 3 11 8 13 14"/>
            </svg>`
    },
    {
      title: "4. Pressão e Saída de Líquido",
      desc: "Pressione suavemente o mamilo e observe se há saída de algum líquido sem que você esteja amamentando. Se notar secreção, anote e informe ao seu médico na consulta.",
      svg: `<svg viewBox="0 0 100 100" class="w-full h-full stroke-current fill-none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="25" y="20" width="50" height="65" rx="8"/>
              <path d="M35 38h30M35 50h20"/>
              <path d="M50 72s-8-5-8-10a4 4 0 1 1 8 0 4 4 0 1 1 8 0c0 5-8 10-8 10z" fill="currentColor"/>
            </svg>`
    }
  ];

  let currentStep = 0;
  let isAnimating = false;

  const stepTitle = document.getElementById('stepTitle');
  const stepDescription = document.getElementById('stepDescription');
  const stepIllustration = document.getElementById('stepIllustration');
  const stepCounterNumber = document.getElementById('stepCounterNumber');
  const stepDots = document.getElementById('stepDots');
  const prevStepBtn = document.getElementById('prevStepBtn');
  const nextStepBtn = document.getElementById('nextStepBtn');

  // Adiciona classes de transição CSS nos elementos
  const animatedElements = [stepIllustration, stepTitle, stepDescription];
  animatedElements.forEach(el => {
    if (el) {
      el.classList.add('transition-all', 'duration-300', 'ease-in-out');
    }
  });

  function renderStepDots() {
    if (!stepDots) return;
    stepDots.innerHTML = '';
    steps.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `h-2.5 rounded-full transition-all duration-300 ${idx === currentStep ? 'bg-brand-700 dark:bg-brand-400 w-6' : 'bg-zinc-200 dark:bg-zinc-700 w-2.5'}`;
      dot.setAttribute('aria-label', `Ir para etapa ${idx + 1}`);
      dot.addEventListener('click', () => {
        if (currentStep !== idx && !isAnimating) {
          currentStep = idx;
          updateStep();
        }
      });
      stepDots.appendChild(dot);
    });
  }

  function updateStep() {
    if (isAnimating) return;
    isAnimating = true;

    // 1. Inicia animação de saída (fade out + descida suave)
    animatedElements.forEach(el => {
      if (el) {
        el.classList.add('opacity-0', 'translate-y-2', 'scale-95');
        el.classList.remove('opacity-100', 'translate-y-0', 'scale-100');
      }
    });

    // 2. Troca o conteúdo após 200ms
    setTimeout(() => {
      const step = steps[currentStep];

      if (stepTitle) stepTitle.textContent = step.title;
      if (stepDescription) stepDescription.textContent = step.desc;
      if (stepIllustration) stepIllustration.innerHTML = step.svg;
      if (stepCounterNumber) stepCounterNumber.textContent = currentStep + 1;

      if (prevStepBtn) prevStepBtn.disabled = currentStep === 0;
      if (nextStepBtn) {
        nextStepBtn.textContent = currentStep === steps.length - 1 ? 'Reiniciar Guia' : 'Próximo Passo';
      }

      renderStepDots();

      // 3. Aplica animação de entrada (fade in + subida suave)
      animatedElements.forEach(el => {
        if (el) {
          el.classList.remove('opacity-0', 'translate-y-2', 'scale-95');
          el.classList.add('opacity-100', 'translate-y-0', 'scale-100');
        }
      });

      isAnimating = false;
    }, 200);
  }

  if (prevStepBtn) {
    prevStepBtn.addEventListener('click', () => {
      if (currentStep > 0 && !isAnimating) {
        currentStep--;
        updateStep();
      }
    });
  }

  if (nextStepBtn) {
    nextStepBtn.addEventListener('click', () => {
      if (!isAnimating) {
        if (currentStep < steps.length - 1) {
          currentStep++;
        } else {
          currentStep = 0;
        }
        updateStep();
      }
    });
  }

  // Carregamento inicial
  updateStep();

  /* -------------------------------------------------------------
   * 4. ACCORDIONS
   * ------------------------------------------------------------- */
  const accordions = document.querySelectorAll('.accordion-header');
  accordions.forEach(header => {
    header.addEventListener('click', () => {
      const body = header.nextElementSibling;
      const icon = header.querySelector('.accordion-icon');
      
      if (body) body.classList.toggle('hidden');
      if (icon) icon.classList.toggle('rotate-180');
    });
  });

  /* -------------------------------------------------------------
   * 5. QUIZ INTERATIVO (MITO OU VERDADE)
   * ------------------------------------------------------------- */
  const quizQuestions = [
    {
      q: "Só quem tem casos na família precisa se preocupar com o câncer de mama.",
      a: false,
      exp: "Mito! Cerca de 80% a 85% dos casos de câncer de mama acontecem em mulheres sem nenhum histórico familiar da doença."
    },
    {
      q: "Todo caroço encontrado na mama é câncer.",
      a: false,
      exp: "Mito! A grande maioria dos nódulos mamários é benigna (como cistos e fibroadenomas). Porém, apenas a consulta médica e exames podem confirmar."
    },
    {
      q: "Praticar atividade física regularmente ajuda na prevenção.",
      a: true,
      exp: "Verdade! Exercícios físicos regulares, manutenção do peso adequado e alimentação saudável reduzem significativamente o risco."
    },
    {
      q: "Homens também podem desenvolver câncer de mama.",
      a: true,
      exp: "Verdade! Embora raro (representa cerca de 1% do total de casos), homens também possuem tecido mamário e podem desenvolver a doença."
    },
    {
      q: "Se eu não sentir nenhuma dor nas mamas, não preciso fazer exames.",
      a: false,
      exp: "Mito! Na fase inicial, o câncer de mama geralmente não provoca dor. A mamografia serve justamente para detectar alterações subclínicas imperceptíveis."
    }
  ];

  let currentQuizIdx = 0;
  let quizScore = 0;
  const quizContainer = document.getElementById('quizContainer');

  function renderQuiz() {
    if (!quizContainer) return;

    if (currentQuizIdx >= quizQuestions.length) {
      renderQuizResults();
      return;
    }

    const q = quizQuestions[currentQuizIdx];

    quizContainer.innerHTML = `
      <div>
        <div class="flex items-center justify-between text-xs font-semibold text-brand-700 dark:text-brand-400 mb-4">
          <span>PERGUNTA ${currentQuizIdx + 1} DE ${quizQuestions.length}</span>
          <span>Pontuação: ${quizScore}</span>
        </div>
        
        <h3 class="font-serif text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
          "${q.q}"
        </h3>

        <div class="grid sm:grid-cols-2 gap-4 mb-6" id="quizOptions">
          <button data-answer="false" class="quiz-btn p-4 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 hover:border-brand-600 font-bold text-zinc-800 dark:text-zinc-200 transition-all flex items-center justify-center gap-2">
             Mito
          </button>
          <button data-answer="true" class="quiz-btn p-4 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 hover:border-brand-600 font-bold text-zinc-800 dark:text-zinc-200 transition-all flex items-center justify-center gap-2">
             Verdade
          </button>
        </div>

        <div id="quizFeedback" class="hidden p-4 rounded-xl text-sm leading-relaxed mb-4"></div>
      </div>

      <div class="flex justify-end pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <button id="nextQuizBtn" class="hidden px-6 py-2.5 rounded-xl bg-brand-700 text-white font-semibold hover:bg-brand-800 transition-all">
          ${currentQuizIdx === quizQuestions.length - 1 ? 'Ver Resultado Final' : 'Próxima Pergunta'}
        </button>
      </div>
    `;

    const buttons = quizContainer.querySelectorAll('.quiz-btn');
    const feedbackEl = document.getElementById('quizFeedback');
    const nextBtn = document.getElementById('nextQuizBtn');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const chosen = btn.getAttribute('data-answer') === 'true';
        const isCorrect = chosen === q.a;

        if (isCorrect) quizScore++;

        buttons.forEach(b => b.disabled = true);

        if (isCorrect) {
          btn.classList.add('bg-emerald-100', 'border-emerald-500', 'text-emerald-900', 'dark:bg-emerald-950/80', 'dark:text-emerald-200');
          feedbackEl.className = "p-4 rounded-xl text-sm leading-relaxed mb-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200";
          feedbackEl.innerHTML = `<strong>Resposta Correta!</strong> ${q.exp}`;
        } else {
          btn.classList.add('bg-rose-100', 'border-rose-500', 'text-rose-900', 'dark:bg-rose-950/80', 'dark:text-rose-200');
          feedbackEl.className = "p-4 rounded-xl text-sm leading-relaxed mb-4 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200";
          feedbackEl.innerHTML = `<strong>Resposta Incorreta.</strong> ${q.exp}`;
        }

        feedbackEl.classList.remove('hidden');
        nextBtn.classList.remove('hidden');
      });
    });

    nextBtn.addEventListener('click', () => {
      currentQuizIdx++;
      renderQuiz();
    });
  }

  function renderQuizResults() {
    let msg = "";
    if (quizScore === quizQuestions.length) {
      msg = "Parabéns! Você está super informada e pronta para compartilhar conhecimento com outras mulheres.";
    } else if (quizScore >= 3) {
      msg = "Muito bem! Você tem um ótimo conhecimento sobre o tema. Continue se cuidando!";
    } else {
      msg = "Obrigado por responder! O objetivo deste material é justamente esclarecer e informar. Vale a pena rever o conteúdo da página.";
    }

    quizContainer.innerHTML = `
      <div class="text-center py-6 space-y-4">
        <div class="w-16 h-16 mx-auto rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 flex items-center justify-center text-2xl font-bold">
          ${quizScore}/${quizQuestions.length}
        </div>
        <h3 class="font-serif text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          Quiz Concluído!
        </h3>
        <p class="text-zinc-600 dark:text-zinc-300 max-w-md mx-auto text-base leading-relaxed">
          ${msg}
        </p>
        <button id="restartQuizBtn" class="mt-4 px-8 py-3 rounded-xl bg-brand-700 text-white font-semibold hover:bg-brand-800 transition-all">
          Refazer Quiz
        </button>
      </div>
    `;

    document.getElementById('restartQuizBtn').addEventListener('click', () => {
      currentQuizIdx = 0;
      quizScore = 0;
      renderQuiz();
    });
  }

  renderQuiz();

  /* -------------------------------------------------------------
   * 6. CHECKLIST INTERATIVO (LOCALSTORAGE)
   * ------------------------------------------------------------- */
  const checklistData = [
    "Marquei minha consulta ginecológica de rotina",
    "Conversei com um profissional sobre o exame de mamografia",
    "Fiz a autoavaliação e conheço o aspecto normal das minhas mamas",
    "Reservei tempo na semana para praticar exercícios físicos",
    "Conversei com minha família sobre histórico de saúde",
    "Compartilhei esta página com uma mulher que eu amo"
  ];

  const CHECKLIST_STORAGE_KEY = 'outubro_rosa_checklist_state_v1';
  let savedState = [];

  try {
    savedState = JSON.parse(localStorage.getItem(CHECKLIST_STORAGE_KEY)) || [];
  } catch (e) {
    savedState = [];
  }

  const checklistItemsContainer = document.getElementById('checklistItems');
  const progressBar = document.getElementById('progressBar');
  const progressPercentText = document.getElementById('progressPercentText');
  const progressFeedbackText = document.getElementById('progressFeedbackText');

  function updateChecklistProgress() {
    if (!progressBar || !progressPercentText || !progressFeedbackText) return;

    const checkedCount = savedState.filter(Boolean).length;
    const total = checklistData.length;
    const pct = Math.round((checkedCount / total) * 100);

    progressBar.style.width = `${pct}%`;
    progressPercentText.textContent = `${pct}% Concluído`;

    if (pct === 0) {
      progressFeedbackText.textContent = "Comece marcando os itens abaixo.";
    } else if (pct < 100) {
      progressFeedbackText.textContent = `${checkedCount} de ${total} cuidados concluídos. Continue!`;
    } else {
      progressFeedbackText.textContent = "Parabéns! Todos os cuidados com a sua saúde estão em dia!";
    }
  }

  function renderChecklist() {
    if (!checklistItemsContainer) return;
    checklistItemsContainer.innerHTML = '';

    checklistData.forEach((text, idx) => {
      const isChecked = !!savedState[idx];
      const item = document.createElement('label');
      item.className = `flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${isChecked ? 'bg-brand-50/60 dark:bg-brand-950/30 border-brand-200 dark:border-brand-900' : 'bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-700/60'}`;

      item.innerHTML = `
        <input type="checkbox" ${isChecked ? 'checked' : ''} class="mt-0.5 w-5 h-5 rounded border-zinc-300 text-brand-600 focus:ring-brand-500 transition-all">
        <span class="text-sm sm:text-base text-zinc-800 dark:text-zinc-200 font-medium ${isChecked ? 'line-through text-zinc-400 dark:text-zinc-500' : ''}">${text}</span>
      `;

      const checkbox = item.querySelector('input');
      checkbox.addEventListener('change', () => {
        savedState[idx] = checkbox.checked;
        try {
          localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(savedState));
        } catch (e) {}
        
        renderChecklist();
        updateChecklistProgress();
      });

      checklistItemsContainer.appendChild(item);
    });

    updateChecklistProgress();
  }

  renderChecklist();

  /* -------------------------------------------------------------
   * 7. COMPARTILHAMENTO
   * ------------------------------------------------------------- */
  const shareBtn = document.getElementById('shareChecklistBtn');
  const shareMsg = document.getElementById('shareStatusMsg');

  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      const shareData = {
        title: 'Outubro Rosa | Saúde da Mulher',
        text: 'Você não pode se colocar por último. Confira o guia completo de autocuidado e prevenção do câncer de mama.',
        url: window.location.href
      };

      if (navigator.share) {
        navigator.share(shareData).catch(() => {});
      } else if (shareMsg) {
        const tempInput = document.createElement('input');
        tempInput.value = window.location.href;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);

        shareMsg.classList.remove('hidden');
        setTimeout(() => {
          shareMsg.classList.add('hidden');
        }, 3000);
      }
    });
  }

});
