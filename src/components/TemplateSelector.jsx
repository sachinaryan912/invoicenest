// src/pages/TemplateSelector.jsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

const TemplateSelector = ({ selectedTemplate, onSelect }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      const snapshot = await getDocs(collection(db, 'templates'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTemplates(data);
      setLoading(false);
    };
    fetchTemplates();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading templates...</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Select a Template</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`border rounded-lg overflow-hidden shadow-md cursor-pointer transition transform hover:scale-105 ${
                selectedTemplate === template.templateId ? 'ring-2 ring-indigo-500' : ''
              }`}
              onClick={() => onSelect(template.templateId)}
            >
              <img
                src={template.previewURL || '/default-template.png'}
                alt={template.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{template.name}</h3>
                <p className="text-sm text-gray-500 capitalize">{template.category} — {template.type}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;
