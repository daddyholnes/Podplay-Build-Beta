import React, { useState } from 'react';
import { useGeminiVertexContext } from './GeminiVertexContext';
import { Button } from '~/components/ui/Button';
import { Label } from '~/components/ui/Label';
import { Textarea } from '~/components/ui/Textarea';
import { Switch } from '~/components/ui/Switch';
import { Upload, X, Book } from 'lucide-react';
import { cn } from '~/utils';
import { v4 as uuidv4 } from 'uuid';

export default function RAGPanel({ className }) {
  const { useRAG, setUseRAG, documents, setDocuments } = useGeminiVertexContext();
  const [activeDocId, setActiveDocId] = useState(null);
  const [documentContent, setDocumentContent] = useState('');
  const [documentTitle, setDocumentTitle] = useState('');

  // Add a new document to the RAG context
  const addDocument = () => {
    if (!documentContent.trim()) return;
    
    const newDoc = {
      id: uuidv4(),
      title: documentTitle.trim() || `Document ${documents.length + 1}`,
      content: documentContent.trim(),
    };
    
    setDocuments([...documents, newDoc]);
    setDocumentContent('');
    setDocumentTitle('');
  };

  // Remove a document from the RAG context
  const removeDocument = (id) => {
    setDocuments(documents.filter(doc => doc.id !== id));
    if (activeDocId === id) {
      setActiveDocId(null);
      setDocumentContent('');
      setDocumentTitle('');
    }
  };

  // Edit an existing document
  const editDocument = (doc) => {
    setActiveDocId(doc.id);
    setDocumentContent(doc.content);
    setDocumentTitle(doc.title);
  };

  // Save changes to an existing document
  const saveDocumentChanges = () => {
    if (!activeDocId || !documentContent.trim()) return;
    
    setDocuments(documents.map(doc => 
      doc.id === activeDocId ? 
        { ...doc, title: documentTitle.trim() || doc.title, content: documentContent.trim() } : 
        doc
    ));
    
    setActiveDocId(null);
    setDocumentContent('');
    setDocumentTitle('');
  };

  // Cancel editing
  const cancelEditing = () => {
    setActiveDocId(null);
    setDocumentContent('');
    setDocumentTitle('');
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center space-x-2">
        <Switch
          id="rag-toggle"
          checked={useRAG}
          onCheckedChange={setUseRAG}
        />
        <Label htmlFor="rag-toggle" className="text-sm font-medium">
          Enable Retrieval Augmented Generation (RAG)
        </Label>
      </div>
      
      {useRAG && (
        <>
          <div className="p-4 bg-card border rounded-md space-y-3">
            <div className="text-sm font-medium">Context Documents</div>
            
            {documents.length === 0 ? (
              <div className="text-sm text-muted-foreground py-2 italic">
                No documents added yet. Add documents below to enhance responses with additional context.
              </div>
            ) : (
              <ul className="space-y-2 max-h-40 overflow-y-auto">
                {documents.map((doc) => (
                  <li 
                    key={doc.id} 
                    className="flex items-center justify-between p-2 bg-card hover:bg-accent/50 rounded text-sm"
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <Book className="h-4 w-4" />
                      <span className="font-medium truncate">{doc.title}</span>
                    </div>
                    <div className="flex space-x-1">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => editDocument(doc)}
                        className="h-7 w-7 p-0"
                      >
                        <span className="sr-only">Edit</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => removeDocument(doc.id)}
                        className="h-7 w-7 p-0 text-destructive"
                      >
                        <span className="sr-only">Remove</span>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            
            <div className="pt-2 border-t">
              <div className="text-sm font-medium mb-2">
                {activeDocId ? 'Edit Document' : 'Add Document'}
              </div>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="doc-title" className="text-xs mb-1 block">Title</Label>
                  <input
                    id="doc-title"
                    value={documentTitle}
                    onChange={(e) => setDocumentTitle(e.target.value)}
                    className="w-full h-8 px-3 py-1 bg-background border rounded-md text-sm"
                    placeholder="Document title"
                  />
                </div>
                <div>
                  <Label htmlFor="doc-content" className="text-xs mb-1 block">Content</Label>
                  <Textarea
                    id="doc-content"
                    value={documentContent}
                    onChange={(e) => setDocumentContent(e.target.value)}
                    className="min-h-[100px] text-sm"
                    placeholder="Paste or type document content here..."
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  {activeDocId ? (
                    <>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={cancelEditing}
                      >
                        Cancel
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={saveDocumentChanges}
                      >
                        Save Changes
                      </Button>
                    </>
                  ) : (
                    <Button 
                      size="sm" 
                      onClick={addDocument}
                      disabled={!documentContent.trim()}
                    >
                      <Upload className="mr-1 h-4 w-4" /> Add Document
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}