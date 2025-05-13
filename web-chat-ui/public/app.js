// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    
    // Ensure page starts at the top
    window.scrollTo(0, 0);
    setTimeout(() => window.scrollTo(0, 0), 100); // Double ensure after a delay
    
    // Views
    const landingView = document.getElementById('landing-view');
    const chatView = document.getElementById('chat-view');

    // Buttons
    const beginBtn = document.getElementById('begin-investigation-btn');
    const backBtn = document.getElementById('back-btn');

    // Chat elements
    const messageList = document.getElementById('message-list');
    const messageForm = document.getElementById('message-form');
    const messageInput = document.getElementById('message-input');
    const sendButton = messageForm.querySelector('button');
    // Add logging to confirm elements are found
    console.log("Elements found:", { messageForm, messageInput, sendButton });

    // Explicitly enable all text features on iOS
    messageInput.setAttribute('autocomplete', 'on');
    messageInput.setAttribute('autocorrect', 'on');
    messageInput.setAttribute('autocapitalize', 'sentences');
    messageInput.setAttribute('spellcheck', 'true');
    messageInput.style.overflowY = 'hidden'; // Ensure JS resizing works
    messageInput.style.resize = 'none'; // Prevent manual resize

    // API Details - Injected from environment variable
    const agentEndpoint = "/api/chat";
    const pdfBaseUrl = 'https://your-cdn.example.com/db-cooper-files';
    console.log("ACTUAL ENDPOINT URL:", agentEndpoint);
    console.log("ENDPOINT URL LENGTH:", agentEndpoint.length);
    console.log("ENDPOINT URL TYPE:", typeof agentEndpoint);
    
    // Store chat history for context (optional but recommended)
    let chatHistory = [];

    // Configure marked.js (optional but recommended for security)
    marked.setOptions({
        // gfm: true, // Use GitHub Flavored Markdown (default true)
        // breaks: false, // Add <br> on single line breaks (default false)
        sanitize: true // IMPORTANT: Enable sanitization to prevent XSS
    });

    // --- Source URL Mapping Logic (Ensure this block exists) --- 
    // Simplified mapping: strip 'healthbasics/' and prefix with CDN URL
    const sourceMappings = {
        'healthbasics/': 'https://healthbasics.tor1.cdn.digitaloceanspaces.com/'
    };

    // --- Rewritten function to generate source URL based on mapping --- 
    function generateSourceUrl(internalSourcePath) {
        // console.log(`[generateSourceUrl] Called with: ${internalSourcePath}`); // DEBUG
        if (!internalSourcePath || typeof internalSourcePath !== 'string') {
            return null;
        }
        internalSourcePath = internalSourcePath.trim();
        
        let matchingPrefix = null;
        let publicBaseUrl = null;
        let filenamePart = internalSourcePath; 
        // console.log(`[generateSourceUrl] Starting prefix search for: ${internalSourcePath}`); // DEBUG
        for (const prefix in sourceMappings) {
            if (internalSourcePath.startsWith(prefix)) {
                // console.log(`  -> Potential match: prefix='${prefix}', currentLongest='${matchingPrefix || ''}'`); // DEBUG
                if (matchingPrefix === null || prefix.length > matchingPrefix.length) {
                    matchingPrefix = prefix;
                    publicBaseUrl = sourceMappings[prefix];
                    filenamePart = internalSourcePath.substring(prefix.length);
                    // console.log(`    --> New longest match found! BaseURL: ${publicBaseUrl}, FilenamePart: ${filenamePart}`); // DEBUG
                }
            }
        }
        // console.log(`[generateSourceUrl] Prefix search finished. Final BaseURL: ${publicBaseUrl}, Final FilenamePart: ${filenamePart}`); // DEBUG
        if (!publicBaseUrl) {
            console.warn(`No mapping prefix for path: ${internalSourcePath}. Using default CDN base.`);
            publicBaseUrl = sourceMappings['healthbasics/'];
            // Use entire path as filenamePart when prefix missing
        }
        let processedFilename = filenamePart;

        // 3. Use original filename without converting extensions
        const finalFilenamePart = processedFilename;

        // 4. URL-encode the filename part
        const encodedFilenameParts = finalFilenamePart.split('/').map(part => encodeURIComponent(part));
        const encodedFilename = encodedFilenameParts.join('/');

        // 5. Combine base URL and encoded filename
        const finalUrl = publicBaseUrl.replace(/\/$/, '') + '/' + encodedFilename.replace(/^\//, '');
        return finalUrl;
    }

    // --- View Switching --- //

    function showView(viewToShow) {
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active-view');
        });
        if (viewToShow) {
            viewToShow.classList.add('active-view');
        }
        
        // Ensure page is scrolled to top when switching views
        window.scrollTo(0, 0);
    }

    beginBtn.addEventListener('click', () => {
        showView(chatView);
        // Completely remove auto-focus for mobile
        if (!isMobileDevice()) {
            // Only focus on desktop
            setTimeout(() => messageInput.focus(), 100);
        }
        console.log("Chat view opened.");
    });

    backBtn.addEventListener('click', () => {
        showView(landingView);
        // Blur any focused element when going back
        if (document.activeElement) {
            document.activeElement.blur();
        }
    });

    // --- Chat Interaction --- //

    // Function to adjust textarea height dynamically
    function adjustTextareaHeight(element) {
        if (!element) return;
        element.style.height = '1px'; // Reset height
        const newHeight = Math.max(element.scrollHeight, parseInt(window.getComputedStyle(element).minHeight));
        element.style.height = newHeight + 'px';

        // Adjust message list padding based on footer height (optional, add if needed)
        // const footer = document.querySelector('.chat-footer');
        // if (footer && messageList) {
        //     const footerHeight = footer.offsetHeight;
        //     const extraPadding = 10;
        //     messageList.style.paddingBottom = `${footerHeight + extraPadding}px`;
        //     messageList.scrollTop = messageList.scrollHeight;
        // }
    }

    function addUserMessageToUI(text) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'user');
        messageDiv.textContent = text;
        messageList.appendChild(messageDiv);
        messageList.scrollTop = messageList.scrollHeight;
    }

    // Handle form submission - Updated for Markdown rendering
    messageForm.addEventListener('submit', async (e) => {
        console.log("--- Submit Event Fired! ---");
        e.preventDefault();
        const userText = messageInput.value.trim();
        if (!userText) return;

        addUserMessageToUI(userText);
        chatHistory.push({ role: 'user', content: userText });

        // --- Create Bot Message Structure --- 
        const botMessageDiv = document.createElement('div');
        botMessageDiv.classList.add('message', 'bot');
        
        const details = document.createElement('details');
        details.classList.add('thinking-details');
        
        const summary = document.createElement('summary');
        summary.classList.add('thinking-summary');
        summary.innerHTML = 'Thinking... <span class="pulse"></span>';
        
        const thinkingContent = document.createElement('div');
        thinkingContent.classList.add('thinking-content');
        
        details.appendChild(summary);
        details.appendChild(thinkingContent);
        
        const answerContent = document.createElement('div');
        answerContent.classList.add('answer-content');
        
        botMessageDiv.appendChild(details);
        botMessageDiv.appendChild(answerContent);
        messageList.appendChild(botMessageDiv);
        messageList.scrollTop = messageList.scrollHeight;
        // --- End Structure --- 
        
        messageInput.value = '';
        adjustTextareaHeight(messageInput); // Reset height after clearing
        messageInput.disabled = true;
        sendButton.disabled = true;

        console.log(`>>> Sending to Agent API (stream): ${userText}`);

        try {
            const response = await fetch(agentEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: userText })
            });

            console.log(`[FETCH] Response received. Status: ${response.status}, OK: ${response.ok}`);

            if (!response.ok) {
                // existing error-handling remains
                let errorText = 'Unknown error';
                try { errorText = await response.text(); } catch {};
                answerContent.innerHTML = marked.parse(`Error: ${response.status} - ${errorText}`);
                summary.textContent = 'Error';
                messageInput.disabled = false;
                sendButton.disabled = false;
                return;
            }

            // Non-streaming JSON response handling
            const jsonResult = await response.json();
            const respText = jsonResult.response ?? JSON.stringify(jsonResult);
            summary.textContent = 'Answer';
            answerContent.innerHTML = marked.parse(respText);
            // Append source links if retrieval info present
            const retrievals = jsonResult.retrieval_info?.results || [];
            if (retrievals.length) {
                const sourcesDiv = document.createElement('div');
                sourcesDiv.classList.add('sources');
                sourcesDiv.innerHTML = '<strong>Sources:</strong> ';
                retrievals.forEach((item, idx) => {
                    const srcPath = item.metadata?.source || item.source || item.id || '';
                    if (!srcPath) return;
                    const baseName = srcPath.replace(/\.md$/i, '');
                    const pdfName = `${baseName}.pdf`;
                    const url = `${pdfBaseUrl}/${encodeURIComponent(pdfName)}`;
                    const a = document.createElement('a');
                    a.href = url;
                    a.textContent = pdfName;
                    a.target = '_blank';
                    sourcesDiv.appendChild(a);
                    if (idx < retrievals.length - 1) sourcesDiv.appendChild(document.createTextNode(', '));
                });
                answerContent.appendChild(sourcesDiv);
            }
            messageInput.disabled = false;
            sendButton.disabled = false;
            return;

        } catch (error) {
            // Handle network errors or errors thrown during processing
            console.error('[FETCH] Error caught in outer catch block:', error);
            if (answerContent.innerHTML === "") { // Check innerHTML now
                 answerContent.innerHTML = marked.parse(`Error processing response stream: ${error.message}`); // Include error message
                 summary.textContent = "Stream Error";
            }
        } finally {
            // Re-enable form 
            messageInput.disabled = false;
            sendButton.disabled = !messageInput.value.trim(); 
            messageInput.focus();
            summary.querySelector('.pulse')?.remove(); // Ensure pulse is removed
        }
    });

    // Initial state setup
    showView(landingView);
    sendButton.disabled = true;

    messageInput.addEventListener('input', () => {
        const isDisabled = !messageInput.value.trim();
        sendButton.disabled = isDisabled;
        // console.log(`Input changed. Text: "${messageInput.value}", Send button disabled: ${isDisabled}`);
        adjustTextareaHeight(messageInput); // Adjust height on input
    });

    // Handle Shift+Enter for new lines but normal Enter for submission (clicks send button)
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            if (e.shiftKey) {
                // SHIFT + ENTER: Allow default behavior (inserting a new line)
                return;
            } else {
                // PLAIN ENTER:
                e.preventDefault(); // PREVENT the default newline behavior
                
                // Only submit if the input is not empty and the send button isn't disabled
                if (messageInput.value.trim() && !sendButton.disabled) {
                    console.log("Enter pressed, clicking send button.");
                    sendButton.click(); // <<< CLICK THE SEND BUTTON
                } else {
                    console.log("Enter pressed, but input is empty or button disabled. Doing nothing.");
                }
            }
        }
    });

    // Helper function to detect mobile devices
    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Initial adjustment in case of pre-filled content 
    adjustTextareaHeight(messageInput);

});