# lexicon: high-performance prompt engineering engine

welcome to the repository for lexicon, an intelligent prompt engineering assistant built using python, fastapi, and the groq api. designed to bridge the gap between "lazy" user intent and high-quality model output, lexicon takes minimal inputs and expands them into structured, elite-tier prompts. this project showcases full-stack development, featuring asynchronous backend processing and a highly interactive, responsive frontend.

# tech stack

- **backend framework:** fastapi (python)
- **ai engine:** groq api (meta llama-3.1-8b-instant)
- **security:** python-dotenv for environment variable management
- **frontend:** html5, modern css (custom sliding inversion animations), poppins/caveat fonts
- **hosting:** render (web service)

# key features

- **intelligent expansion:** leverages llama 3.1 to translate vague, minimal prompts into comprehensive, structured instructions with role, objective, tone, and constraints.
- **immersive ux:** features a custom "sliding wipe" inversion animation that flips the entire ui theme during generation.
- **automated formatting:** dynamically parses raw ai output into clean, structured sections for better readability.
- **resilient architecture:** includes a robust, animated error-handling modal that intelligently manages server cold starts and connection drops.

# local development setup

follow these steps to run the lexicon backend and frontend on your local machine.

```bash
1. clone the repository
git clone [https://github.com/mohammed-owzzz/lexicon.git](https://github.com/mohammed-owzzz/lexicon.git)
cd lexicon

2. install dependencies
ensure you have python installed, then run:

Bash
pip install fastapi uvicorn groq python-dotenv

3. set up environment variables
create a file named .env in the root directory. add your groq api key:

Plaintext
GROQ_API_KEY=your_actual_api_key_here

4. run the server
start the fastapi server using uvicorn:

Bash
uvicorn main:app --reload
the api will be available at [http://127.0.0.1:8000](http://127.0.0.1:8000).
api documentation
POST /expand
accepts a base prompt and returns an expanded, structured prompt ready for professional use.

request:

JSON
{
  "base_prompt": "write a python web scraper"
}
response:

JSON
{
  "status": "success",
  "expanded_prompt": "[role]\npython automation expert\n\n[objective]\ncreate a robust, scalable web scraping script using beautifulsoup and requests to extract data from a target url.\n\n[tone/style]\ntechnical, clean, and highly documented.\n\n[constraints]\n- use error handling (try/except).\n- implement polite user-agent headers.\n- output data to a structured csv format."
}