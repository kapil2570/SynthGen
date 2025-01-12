

const home = Vue.component("home", {
  data() {
    return {
      selectedDataset: 'Employee',
      selectedFormat: 'CSV',
      rowCount: 1000,
      isGenerating: false,
      error: null,
      rowCountError: null,
      token: localStorage.getItem("auth-token"),

    };
  },
  methods: {
    async generateData() {
      if (this.rowCount < 1000 || this.rowCount > 10000) {
        this.rowCountError = 'Number of rows must be between 1000 and 10000.';
        return;
      }

      this.isGenerating = true;
      this.error = null;
      this.rowCountError = null;

      try {
        const res = await fetch('/employee', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": this.token,

          },
          body: JSON.stringify({
            dataset: this.selectedDataset,
            format: this.selectedFormat,
            count: this.rowCount
          }),
        });

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${this.selectedDataset}_data.${this.getFileExtension()}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (err) {
        console.error('Error:', err);
        this.error = 'An error occurred while generating the data. Please try again.';
      } finally {
        this.isGenerating = false;
      }
    },
    getFileExtension() {
      switch (this.selectedFormat) {
        case 'CSV': return 'csv';
        case 'Excel': return 'xlsx';
        case 'Doc': return 'doc';
        case 'JSON': return 'json';
        default: return 'txt';
      }
    },
    validateRowCount() {
      if (this.rowCount < 1000 || this.rowCount > 10000) {
        this.rowCountError = 'Number of rows must be between 1000 and 10000.';
      } else {
        this.rowCountError = null;
      }
    }
  },
  template: `
    <div class="main-container d-flex align-items-center justify-content-center">
      <div class="content-container border rounded shadow-lg p-5 bg-white" style="width: 80%; max-width: 600px;">
        <h1 class="text-center mb-4" style="color: #d04a02;">Synthetic Data Generator</h1>
        
        <form @submit.prevent="generateData">
          <div class="mb-3">
            <label class="form-label" for="dataset">Dataset</label>
            <select id="dataset" v-model="selectedDataset" class="form-select">
              <option value="Employee">Employee Dataset</option>
              <option value="PCI">PCI Dataset</option>
            </select>
          </div>
          
          <div class="mb-3">
            <label class="form-label" for="format">Download Format</label>
            <select id="format" v-model="selectedFormat" class="form-select">
              <option value="CSV">CSV</option>
              <option value="Excel">Excel</option>
              <option value="Doc">Doc</option>
              <option value="JSON">JSON</option>
            </select>
          </div>
          
          <div class="mb-3">
            <label class="form-label" for="rowCount">Number of Rows (1000-10000)</label>
            <input 
              type="number" 
              id="rowCount" 
              v-model.number="rowCount" 
              @input="validateRowCount"
              min="1000" 
              max="10000" 
              class="form-control"
            >
            <p v-if="rowCountError" class="text-danger mt-1">{{ rowCountError }}</p>
          </div>
          
          <button 
            type="submit"
            :disabled="isGenerating || rowCountError" 
            class="btn w-100 text-white"
            style="background-color: #d04a02;"
          >
            {{ isGenerating ? 'Generating...' : 'Generate and Download Data' }}
          </button>
          
          <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
        </form>
      </div>
    </div>
  `
});

export default home;