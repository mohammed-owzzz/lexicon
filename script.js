const CONFIG = {
    HOST: "https://lexicon-ust5.onrender.com"
};

const promptInput = document.getElementById('promptInput');
const expandBtn = document.getElementById('expandBtn');
const refreshBtn = document.getElementById('refreshBtn');
const idleState = document.getElementById('idleState');
const loadingState = document.getElementById('loadingState');
const resultState = document.getElementById('resultState');
const errorState = document.getElementById('errorState');
const summaryText = document.getElementById('summaryText');
const copyBtn = document.getElementById('copyBtn');
const resultTitle = document.getElementById('resultTitle');
const wrapper = document.querySelector('.textarea-wrapper');

let successTimeout;
let errorTimeout;
let isAnimating = false;
let currentRawPrompt = "";

function formatOutput(text) {
    let clean = text.replace(/[*_#`]/g, '');
    clean = clean.replace(/^\s*\[(.*?)\]\n?/gm, '<span class="category-label">$1</span>');
    return clean.trim();
}

function triggerSuccessGlow() {
    wrapper.classList.add('success-state');
    clearTimeout(successTimeout);
    successTimeout = setTimeout(() => {
        wrapper.classList.remove('success-state');
    }, 2500);
}

triggerSuccessGlow();

function switchState(stateElement) {
    idleState.classList.add('hidden');
    loadingState.classList.add('hidden');
    resultState.classList.add('hidden');
    errorState.classList.add('hidden');
    
    idleState.classList.remove('active');
    loadingState.classList.remove('active');
    resultState.classList.remove('active');
    errorState.classList.remove('active');

    stateElement.classList.remove('hidden');
    
    requestAnimationFrame(() => {
        stateElement.classList.add('active');
    });
}

function triggerErrorAnimation() {
    isAnimating = true;
    wrapper.classList.remove('success-state', 'error-state');
    wrapper.classList.add('animating-out');
    clearTimeout(errorTimeout);
    
    setTimeout(() => {
        promptInput.placeholder = "Input required|";
        wrapper.classList.remove('animating-out');
        wrapper.classList.add('animating-in');
        
        void promptInput.offsetWidth; 
        requestAnimationFrame(() => { wrapper.classList.remove('animating-in'); });

        setTimeout(() => {
            if (promptInput.placeholder === "Input required|") {
                wrapper.classList.add('error-state');
            }
        }, 350);

        errorTimeout = setTimeout(() => {
            if(wrapper.classList.contains('error-state') || promptInput.placeholder === "Input required|") {
                revertErrorAnimation();
            } else {
                isAnimating = false;
            }
        }, 1800); 
    }, 400); 
}

function revertErrorAnimation() {
    wrapper.classList.add('animating-out');
    setTimeout(() => {
        wrapper.classList.remove('error-state');
        promptInput.placeholder = "Enter lazy prompt|";
        wrapper.classList.remove('animating-out');
        wrapper.classList.add('animating-in');
        
        void promptInput.offsetWidth; 
        requestAnimationFrame(() => { wrapper.classList.remove('animating-in'); });
        
        setTimeout(() => {
            if (promptInput.placeholder === "Enter lazy prompt|") { triggerSuccessGlow(); }
        }, 350);
        isAnimating = false;
    }, 400);
}

function restorePlaceholder() {
    if (wrapper.classList.contains('error-state') || promptInput.placeholder === "Input required|") {
        clearTimeout(errorTimeout);
        wrapper.classList.remove('error-state', 'animating-out', 'animating-in');
        promptInput.placeholder = "Enter lazy prompt|";
        triggerSuccessGlow();
        isAnimating = false;
    }
}

async function performExpansion() {
    const text = promptInput.value.trim();
    if (!text) {
        if (!isAnimating) triggerErrorAnimation();
        return;
    }

    document.body.classList.toggle('inverted');
    expandBtn.disabled = true;
    switchState(loadingState);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    try {
        const response = await fetch(`${CONFIG.HOST}/expand`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ base_prompt: text }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);
        if (!response.ok) throw new Error('Network response failed');

        const data = await response.json();
        currentRawPrompt = data.expanded_prompt.replace(/#{1,3}\s?/g, '').replace(/\*\*/g, '');
        summaryText.innerHTML = formatOutput(data.expanded_prompt);
        resultTitle.textContent = text;
        
        switchState(resultState);

    } catch (error) {
        clearTimeout(timeoutId);
        switchState(errorState);
    } finally {
        expandBtn.disabled = false;
    }
}

expandBtn.addEventListener('click', performExpansion);
refreshBtn.addEventListener('click', performExpansion);

copyBtn.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(currentRawPrompt);
        copyBtn.textContent = 'COPIED';
        copyBtn.classList.add('copied');
        setTimeout(() => {
            copyBtn.textContent = 'COPY';
            copyBtn.classList.remove('copied');
        }, 2000);
    } catch (err) {
        console.error(err);
    }
});

promptInput.addEventListener('input', function() {
    restorePlaceholder();
    this.style.height = 'auto';
    
    if (this.value === '') {
        this.style.height = ''; 
    } else {
        this.style.height = (this.scrollHeight) + 'px';
    }
});

promptInput.addEventListener('focus', restorePlaceholder);
