import React, { useState } from 'react';
import { FiZap, FiTag, FiBookOpen, FiCheckCircle, FiLoader } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { aiService } from '../../utils/gemini.js'; 

export default function AIPanel({ content, onSummaryGenerated, onTagsGenerated, onGrammarChecked, onGlossaryGenerated, className = '' }) {
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);
  const [isCheckingGrammar, setIsCheckingGrammar] = useState(false);
  const [isGeneratingGlossary, setIsGeneratingGlossary] = useState(false);

  const [summary, setSummary] = useState('');
  const [grammarResults, setGrammarResults] = useState('');
  const [glossary, setGlossary] = useState('');

  const generateSummary = async () => {
    if (!content.trim()) return toast.error('Add some content first');
    setIsGeneratingSummary(true);
    try {
      const summaryResult = await aiService.generateSummary(content);
      setSummary(summaryResult); 
      if (onSummaryGenerated) onSummaryGenerated(summaryResult); 
      toast.success('Summary generated!');
    } catch (error) {
      toast.error('Failed to generate summary. Check console for details.');
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const generateTags = async () => {
    if (!content.trim()) return toast.error('Add some content first');
    setIsGeneratingTags(true);
    try {
      const tagsResult = await aiService.suggestTags(content);
      if (onTagsGenerated) onTagsGenerated(tagsResult); 
      toast.success('Tags suggested!');
    } catch (error) {
      toast.error('Failed to generate tags. Check console for details.');
    } finally {
      setIsGeneratingTags(false);
    }
  };

  const checkGrammar = async () => {
    if (!content.trim()) return toast.error('Add some content first');
    setIsCheckingGrammar(true);
    try {
      const grammarResult = await aiService.checkGrammar(content);
      console.log('✅ Grammar result received:', grammarResult);
      
      setGrammarResults(grammarResult); 
      if (onGrammarChecked) {
        console.log('✅ Calling onGrammarChecked callback');
        onGrammarChecked(grammarResult);
      }
      
      if (grammarResult.includes('No grammar errors found')) {
        toast.success('No grammar errors found!');
      } else {
        toast.success('Grammar check completed!');
      }
    } catch (error) {
      console.error('Grammar check error:', error);
      toast.error('Failed to check grammar. Check console for details.');
    } finally {
      setIsCheckingGrammar(false);
    }
  };

  const generateGlossary = async () => {
    if (!content.trim()) return toast.error('Add some content first');
    setIsGeneratingGlossary(true);
    try {
      const glossaryResult = await aiService.generateGlossary(content);
      console.log('✅ Glossary result received:', glossaryResult);
      
      setGlossary(glossaryResult); 
      if (onGlossaryGenerated) {
        console.log('✅ Calling onGlossaryGenerated callback');
        onGlossaryGenerated(glossaryResult);
      }
      
      toast.success('Glossary generated!');
    } catch (error) {
      console.error('Glossary generation error:', error);
      toast.error('Failed to generate glossary. Check console for details.');
    } finally {
      setIsGeneratingGlossary(false);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* AI Controls Panel */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
        <div className="flex items-center space-x-2 mb-4">
          <FiZap className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-purple-900">AI Features</h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={generateSummary}
            disabled={isGeneratingSummary || !content.trim()}
            className="flex items-center justify-center space-x-2 p-3 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isGeneratingSummary ? <FiLoader className="w-4 h-4 animate-spin text-purple-600" /> :
              <FiBookOpen className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />}
            <span className="text-sm font-medium text-purple-900">Summary</span>
          </button>

          <button
            onClick={generateTags}
            disabled={isGeneratingTags || !content.trim()}
            className="flex items-center justify-center space-x-2 p-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isGeneratingTags ? <FiLoader className="w-4 h-4 animate-spin text-blue-600" /> :
              <FiTag className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />}
            <span className="text-sm font-medium text-blue-900">Tags</span>
          </button>

          <button
            onClick={checkGrammar}
            disabled={isCheckingGrammar || !content.trim()}
            className="flex items-center justify-center space-x-2 p-3 bg-white border border-green-200 rounded-lg hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isCheckingGrammar ? <FiLoader className="w-4 h-4 animate-spin text-green-600" /> :
              <FiCheckCircle className="w-4 h-4 text-green-600 group-hover:scale-110 transition-transform" />}
            <span className="text-sm font-medium text-green-900">Grammar</span>
          </button>

          <button
            onClick={generateGlossary}
            disabled={isGeneratingGlossary || !content.trim()}
            className="flex items-center justify-center space-x-2 p-3 bg-white border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isGeneratingGlossary ? <FiLoader className="w-4 h-4 animate-spin text-orange-600" /> :
              <FiBookOpen className="w-4 h-4 text-orange-600 group-hover:scale-110 transition-transform" />}
            <span className="text-sm font-medium text-orange-900">Glossary</span>
          </button>
        </div>
      </div>
    </div>
  );
}


