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
    const agentEndpoint = "__AGENT_ENDPOINT_URL__"; // Will be replaced during build
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

        let isThinkingPhase = true;
        let fullThinkingText = "";
        let fullAnswerText = "";
        let sourcesForThisMessage = [];
        const thinkingMarker = "</think>";

        try {
            const response = await fetch(agentEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: chatHistory,
                    stream: true,
                    include_retrieval_info: true 
                })
            });

            console.log(`[FETCH] Response received. Status: ${response.status}, OK: ${response.ok}`);

            if (!response.ok) {
                // Handle API errors before streaming
                let errorText = 'Unknown error';
                try {
                     errorText = await response.text(); // Try to get text for more details
                } catch (textError) {
                    console.error('Could not get error text from response:', textError);
                }
                 console.error(`[FETCH] API Error Response Text: ${errorText}`); // Log error text
                // Use innerHTML for consistency
                answerContent.innerHTML = marked.parse(`Error: ${response.status} - ${errorText || 'Failed to get response from agent.'}`);
                summary.textContent = "Error";
                throw new Error(`API Error ${response.status}`);
            }

            // --- Process Stream --- 
            console.log("[FETCH] Response OK, attempting to process stream...");
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    console.log("Stream finished.");
                    break; // Exit loop when stream is done
                }

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop(); // Keep potential partial line for next chunk

                for (const line of lines) {
                    if (!line.startsWith('data: ')) continue;
                    // console.log("[RAW STREAM DATA]:", line); // <<< Temporarily disabled raw stream debug log
                    
                    try {
                        const jsonStr = line.substring(6);
                        if (jsonStr === '[DONE]') continue;

                        const data = JSON.parse(jsonStr);

                        // *** LOG EVERY PARSED DATA OBJECT ***
                        // console.log("[DEBUG] Parsed stream data object:", JSON.stringify(data)); // Commented out for production

                        // 1. Check for sources (handle direct type OR retrieval block)
                        if (data.type === 'sources' && Array.isArray(data.data)) { 
                            // console.log("Received sources chunk via data.data:", data.data); // DEBUG
                            sourcesForThisMessage.push(...data.data);
                            // console.log("(A) Appended to sourcesForThisMessage, current length:", sourcesForThisMessage.length); // DEBUG
                        } else if (data.retrieval?.retrieved_data && Array.isArray(data.retrieval.retrieved_data)) {
                            // Check for sources within retrieval block (as seen in worker logs)
                            // console.log("Received sources chunk via data.retrieval:", data.retrieval.retrieved_data); // DEBUG
                            const retrievedFilenames = data.retrieval.retrieved_data
                                .map((item) => item?.filename) // Extract filename if object
                                .filter(filename => typeof filename === 'string'); // Keep only strings
                            sourcesForThisMessage.push(...retrievedFilenames);
                            // console.log("(B) Appended to sourcesForThisMessage, current length:", sourcesForThisMessage.length); // DEBUG
                        } 
                        
                        // 2. Check for content delta (independent of sources)
                        const delta = data.choices?.[0]?.delta?.content;
                        if (delta) {
                           // ... (thinking/content delta handling remains the same) ...
                            if (isThinkingPhase) {
                                if (delta.includes(thinkingMarker)) {
                                    const parts = delta.split(thinkingMarker);
                                    fullThinkingText += parts[0];
                                    thinkingContent.innerHTML = marked.parse(fullThinkingText); 
                                    isThinkingPhase = false;
                                    summary.textContent = "Show Thoughts";
                                    summary.querySelector('.pulse')?.remove();
                                    fullAnswerText += parts[1] || "";
                                    answerContent.innerHTML = marked.parse(fullAnswerText);
                                } else {
                                    fullThinkingText += delta;
                                    thinkingContent.innerHTML = marked.parse(fullThinkingText);
                                }
                            } else {
                                fullAnswerText += delta;
                                answerContent.innerHTML = marked.parse(fullAnswerText);
                            }
                           messageList.scrollTop = messageList.scrollHeight;
                        }
                        
                        // 3. Check for finish reason (independent of sources/content)
                        if (data.choices?.[0]?.finish_reason) {
                            console.log("[DEBUG] Received finish_reason:", data.choices[0].finish_reason);
                            // Optionally handle finish reason if needed
                        }

                    } catch (parseError) {
                        console.error("Error parsing stream data line:", line, parseError);
                    }
                }
            }
            // --- End Stream Processing --- 

            // Add final response to history after stream completes
            if (fullAnswerText || fullThinkingText) {
                // Store raw text in history, not HTML
                 chatHistory.push({ role: 'assistant', content: fullThinkingText + (fullThinkingText ? "\n</think>\n" : "") + fullAnswerText });
            }

             // Ensure details are closed if no thinking text was received
             if (!fullThinkingText) {
                details.style.display = 'none'; 
             }

             // --- Process and Render sources --- 
             // Now process the collected sources *after* the loop
             // Build unique list of original internal paths (mapping handles prefix stripping)
             const finalSources = Array.from(new Set(
                 sourcesForThisMessage
                     .map(item => typeof item === 'string' ? item : item?.filename)
                     .filter(Boolean)
             ));
             
             // Render using the finalSources array
             if (finalSources.length > 0) { 
                 const sourcesDiv = document.createElement('div');
                 sourcesDiv.classList.add('sources-list');
                 const details = document.createElement('details');
                 details.classList.add('sources-details');
                 const summary = document.createElement('summary');
                 summary.classList.add('sources-summary');
                 summary.textContent = `Sources (${finalSources.length})`;
                 const sourcesUl = document.createElement('ul');
                 sourcesUl.classList.add('sources-content');

                 try { 
                     finalSources.forEach((source, index) => { // Iterate over finalSources
                        // console.log(`[DEBUG] Rendering source ${index}:`, source); // DEBUG
                        const pdfUrl = generateSourceUrl(source);
                        // console.log(`  -> PDF URL generated:`, pdfUrl); // DEBUG
                        const li = document.createElement('li');
                        if (pdfUrl) {
                            const link = document.createElement('a');
                            link.href = pdfUrl;
                            link.textContent = source; 
                            link.target = "_blank";
                            link.rel = "noopener noreferrer";
                            li.appendChild(link);
                            // console.log("  -> Link element created and appended."); // DEBUG
                        } else {
                            li.textContent = source + " (Link unavailable)"; 
                            // console.log("  -> Fallback text set."); // DEBUG
                        }
                        sourcesUl.appendChild(li);
                        // console.log(`  -> LI element appended to UL.`); // DEBUG
                     });
                 } catch (renderError) {
                     console.error("Error during source rendering loop:", renderError);
                 }

                 details.appendChild(summary);
                 details.appendChild(sourcesUl);
                 sourcesDiv.appendChild(details);
                 botMessageDiv.appendChild(sourcesDiv);
                 messageList.scrollTop = messageList.scrollHeight;
                 // console.log("[DEBUG] Source elements appended to bot message div."); // DEBUG

             } else {
                 // console.log("[DEBUG] No final sources to render."); // DEBUG
             }

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