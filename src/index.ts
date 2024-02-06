interface FormField {
  name: string;
  label: string;
  type: string;
  options?: string[]; // For select, radio, checkbox options
  required?: boolean;
}

interface FormBuilderConfig {
  elementSelector: string;
  fields: FormField[];
  styles?: { [key: string]: string };
}

class FormBuilder {
  private elementSelector: string;
  private formBuilderElement: HTMLElement | null;
  private formConfig: FormField[] = [];

  constructor(config: FormBuilderConfig) {
    this.elementSelector = config.elementSelector || "";
    this.formBuilderElement = null;
    this.formConfig = config.fields || [];

    this.initializeStyles(config.styles || {});
  }

  private initializeStyles(styles: { [key: string]: string }): void {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = Object.entries(styles)
      .map(
        ([property, value]) =>
          `.${this.elementSelector} { ${property}: ${value}; }`
      )
      .join("\n");
    document.head.appendChild(styleTag);
  }

  private createFieldElement(field: FormField): HTMLDivElement {
    const fieldDiv = document.createElement("div");
    fieldDiv.classList.add("form-field");

    switch (field.type) {
      case "text":
      case "number":
        fieldDiv.innerHTML = `<label>${field.label}:</label> <input type="${
          field.type
        }" name="${field.name}" ${field.required ? "required" : ""}><br>`;
        break;
      case "select":
        fieldDiv.innerHTML = `<label>${field.label}:</label> <select name="${
          field.name
        }" ${field.required ? "required" : ""}>${field.options
          ?.map((option) => `<option value="${option}">${option}</option>`)
          .join("")}</select><br>`;
        break;
      case "checkbox":
        fieldDiv.innerHTML = `<input type="checkbox" name="${field.name}" ${
          field.required ? "required" : ""
        }> <label>${field.label}</label><br>`;
        break;
      // Add more cases for other field types as needed
      default:
        break;
    }

    return fieldDiv;
  }

  fbInit() {
    this.formBuilderElement = document.querySelector(this.elementSelector);
    if (!this.formBuilderElement) return;

    // Create form fields based on the configuration
    this.formConfig.forEach((field) => {
      const fieldDiv = this.createFieldElement(field);
      this.formBuilderElement?.appendChild(fieldDiv);
    });
  }

  addField() {
    const fieldName = prompt("Enter field name:");
    const fieldLabel = prompt("Enter field label:");
    const fieldType = prompt(
      "Enter field type (text, number, select, checkbox, etc.):"
    );

    if (fieldName && fieldLabel && fieldType) {
      const options =
        fieldType === "select"
          ? prompt("Enter options, comma-separated (if applicable):")?.split(
              ","
            )
          : undefined;
      const required = confirm("Is this field required?");

      const field: FormField = {
        name: fieldName,
        label: fieldLabel,
        type: fieldType,
        options,
        required,
      };
      this.formConfig.push(field);

      if (this.formBuilderElement) {
        const fieldDiv = this.createFieldElement(field);
        this.formBuilderElement.appendChild(fieldDiv);
      }
    }
  }

  generateJSON() {
    const jsonOutput = JSON.stringify(this.formConfig, null, 2);
    console.log(jsonOutput);
  }
}

export default FormBuilder;
