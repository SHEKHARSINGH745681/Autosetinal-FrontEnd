import { Component } from '@angular/core';

interface DocumentItem {
  id: number;
  name: string;
  file: File;
  url: string; // For preview
}

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent {
  documents: DocumentItem[] = [];
  newDocumentName: string = '';
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  editIndex: number | null = null;

  // Handle file selection
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  // Add or update document
  saveDocument() {
    if (!this.newDocumentName || !this.selectedFile) {
      alert('Please provide a document name and select a file.');
      return;
    }

    if (this.editIndex !== null) {
      // Update existing
      const doc = this.documents[this.editIndex];
      doc.name = this.newDocumentName;
      doc.file = this.selectedFile;
      doc.url = this.previewUrl!;
      this.editIndex = null;
    } else {
      // Add new
      const newDoc: DocumentItem = {
        id: Date.now(),
        name: this.newDocumentName,
        file: this.selectedFile,
        url: this.previewUrl!
      };
      this.documents.push(newDoc);
    }

    // Reset form
    this.newDocumentName = '';
    this.selectedFile = null;
    this.previewUrl = null;
  }

  // Edit document
  editDocument(index: number) {
    const doc = this.documents[index];
    this.newDocumentName = doc.name;
    this.previewUrl = doc.url;
    this.selectedFile = doc.file;
    this.editIndex = index;
  }

  // Delete document
  deleteDocument(index: number) {
    if (confirm('Are you sure you want to delete this document?')) {
      this.documents.splice(index, 1);
      this.resetForm();
    }
  }

  resetForm() {
    this.newDocumentName = '';
    this.selectedFile = null;
    this.previewUrl = null;
    this.editIndex = null;
  }
}
