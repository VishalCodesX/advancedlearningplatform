const welcomeSection = document.getElementById("welcome-section");
const startBtn = document.getElementById("start-btn");
const uploadSection = document.getElementById("upload-section");
const pdfUpload = document.getElementById("pdf-upload");
const summarizeBtn = document.getElementById("summarize-btn");
const loadingIndicator = document.getElementById("loading-indicator");
const summarySection = document.getElementById("summary-section");
const summaryText = document.getElementById("summary-text");
const charCount = document.getElementById("char-count");
const copySummaryBtn = document.getElementById("copy-summary-btn");
const resetBtn = document.getElementById("reset-btn");

// Transition to Upload Page
startBtn.addEventListener("click", () => {
  welcomeSection.style.display = "none";
  uploadSection.style.display = "block";
});

// PDF.js setup
const pdfjsLib = window['pdfjs-dist/build/pdf'];

summarizeBtn.addEventListener("click", () => {
  const file = pdfUpload.files[0];
  if (!file) {
    alert("Please upload a PDF file.");
    return;
  }

  loadingIndicator.style.display = "block";
  uploadSection.style.display = "none";
  extractAndSummarizePDF(file);
});

async function extractAndSummarizePDF(file) {
  const fileReader = new FileReader();
  fileReader.onload = async function () {
    const typedArray = new Uint8Array(this.result);
    const pdf = await pdfjsLib.getDocument(typedArray).promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(" ");
      fullText += pageText + " ";
    }

    const summary = summarizeText(fullText);
    summaryText.innerText = summary;
    charCount.innerText = `Character Count: ${summary.length}`;
    loadingIndicator.style.display = "none";
    summarySection.style.display = "block";
  };

  fileReader.readAsArrayBuffer(file);
}

function summarizeText(text) {
  const sentences = text.split(". ");
  const summaryLength = Math.ceil(sentences.length * 0.5);
  return sentences.slice(0, summaryLength).join(". ") + ".";
}

copySummaryBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(summaryText.innerText);
  alert("Summary copied to clipboard!");
});

resetBtn.addEventListener("click", () => {
  summarySection.style.display = "none";
  uploadSection.style.display = "block";
  pdfUpload.value = "";
});
