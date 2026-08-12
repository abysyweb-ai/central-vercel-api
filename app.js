document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput = document.getElementById('apiKeyInput');
  const masterKeyDisplay = document.getElementById('masterKeyDisplay');
  const endpointItems = document.querySelectorAll('.endpoint-item');
  const requestForm = document.getElementById('requestForm');
  const endpointPath = document.getElementById('endpointPath');
  const httpMethod = document.getElementById('httpMethod');
  const requestBodyGroup = document.getElementById('requestBodyGroup');
  const requestBody = document.getElementById('requestBody');
  const responseOutput = document.getElementById('responseOutput');
  const snippetOutput = document.getElementById('snippetOutput');
  const tabs = document.querySelectorAll('.tab');

  let currentEndpoint = 'health';

  const endpointConfig = {
    health: {
      path: '/api/health',
      method: 'GET',
      hasBody: false,
      defaultBody: ''
    },
    ai: {
      path: '/api/ai/generate',
      method: 'POST',
      hasBody: true,
      defaultBody: JSON.stringify({
        prompt: "Provide a 3-bullet summary of Vercel serverless architecture best practices.",
        model: "gemini-1.5-flash"
      }, null, 2)
    },
    mail: {
      path: '/api/mail/send',
      method: 'POST',
      hasBody: true,
      defaultBody: JSON.stringify({
        to: "abysyweb@gmail.com",
        subject: "Welcome from Central Vercel Master API Gateway",
        html: "<h1>Deployment Successful!</h1><p>Your API is ready to serve all Vercel projects.</p>"
      }, null, 2)
    },
    utils: {
      path: '/api/utils/uuid',
      method: 'GET',
      hasBody: false,
      defaultBody: ''
    }
  };

  const selectEndpoint = (key) => {
    currentEndpoint = key;
    const config = endpointConfig[key];

    endpointItems.forEach(el => {
      el.classList.toggle('active', el.dataset.key === key);
    });

    endpointPath.textContent = config.path;
    httpMethod.textContent = config.method;
    httpMethod.className = `method ${config.method.toLowerCase()}`;

    if (config.hasBody) {
      requestBodyGroup.style.display = 'block';
      requestBody.value = config.defaultBody;
    } else {
      requestBodyGroup.style.display = 'none';
      requestBody.value = '';
    }

    updateSnippet();
  };

  endpointItems.forEach(item => {
    item.addEventListener('click', () => {
      selectEndpoint(item.dataset.key);
    });
  });

  const updateSnippet = () => {
    const config = endpointConfig[currentEndpoint];
    const key = apiKeyInput.value.trim();
    const body = config.hasBody ? requestBody.value : null;

    const snippet = `// Example fetch call for your frontend Vercel projects
async function callCentralApi() {
  const response = await fetch('${window.location.origin}${config.path}', {
    method: '${config.method}',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': '${key}'
    }${body ? `,\n    body: JSON.stringify(${body})` : ''}
  });

  const data = await response.json();
  console.log(data);
  return data;
}`;

    snippetOutput.textContent = snippet;
  };

  apiKeyInput.addEventListener('input', updateSnippet);
  requestBody.addEventListener('input', updateSnippet);

  requestForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const config = endpointConfig[currentEndpoint];
    const key = apiKeyInput.value.trim();

    responseOutput.textContent = '// Sending request...';

    try {
      const options = {
        method: config.method,
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': key
        }
      };

      if (config.hasBody && requestBody.value.trim()) {
        options.body = requestBody.value;
      }

      const res = await fetch(config.path, options);
      const data = await res.json();

      responseOutput.textContent = JSON.stringify(data, null, 2);
    } catch (err) {
      responseOutput.textContent = JSON.stringify({
        error: 'Client Fetch Error',
        message: err.message
      }, null, 2);
    }
  });

  // Tab switching
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      if (tab.dataset.tab === 'response') {
        responseOutput.style.display = 'block';
        snippetOutput.style.display = 'none';
      } else {
        responseOutput.style.display = 'none';
        snippetOutput.style.display = 'block';
      }
    });
  });

  document.getElementById('copyKeyBtn').addEventListener('click', () => {
    navigator.clipboard.writeText(masterKeyDisplay.textContent);
    alert('Master API Key copied to clipboard!');
  });

  selectEndpoint('health');
});
