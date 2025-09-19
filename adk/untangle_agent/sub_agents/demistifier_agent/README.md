# Legal Document Analysis Agents

This document describes the updated agent pipeline for analyzing legal documents and terms of service.

## Overview

The Legal Document Demistifier Pipeline consists of multiple specialized agents that work together to analyze legal documents, identify risks, extract key information, and provide comprehensive summaries for both general users and legal professionals.

## Agent Architecture

### 1. Risk Evaluator Agent
**Purpose**: Analyzes legal documents and identifies potentially risky sections
**Input**: Legal document text
**Output**: RiskEvaluationResult schema
**Key Features**:
- Identifies sections that limit user rights or protections
- Detects clauses that create liability for users
- Finds terms that allow unilateral changes by the company
- Identifies broad data collection or sharing clauses
- Rates overall risk level (Low, Medium, High, Critical)

### 2. Risk Phrase Extractor Agent
**Purpose**: Extracts specific risky phrases for frontend highlighting
**Input**: Legal document text + risk evaluation results
**Output**: RiskPhraseResult schema
**Key Features**:
- Identifies exact text from risky sections
- Provides location information for each phrase
- Categorizes types of risks
- Outputs structured data for frontend highlighting

### 3. Summarizer Agent
**Purpose**: Creates point-wise summaries to demystify complex legal documents
**Input**: Legal document text
**Output**: SummaryResult schema
**Key Features**:
- Breaks down complex legal language
- Identifies document type and complexity level
- Creates clear, numbered summary points
- Explains key terms and concepts

### 4. Merger Agent
**Purpose**: Combines all analysis results into a comprehensive final report
**Input**: Results from all previous agents
**Output**: DemistifierOutput schema
**Key Features**:
- Provides both layman and technical explanations
- Includes comprehensive glossaries
- Structures output for frontend consumption
- Creates overall conclusions and recommendations

## Pipeline Flow

```
Legal Document Input
         ↓
    [Risk Evaluator] → [Risk Phrase Extractor] (Sequential)
         ↓                      ↓
    [Summarizer] ←→ [Risk Analyzer Pipeline] (Parallel)
         ↓
    [Merger Agent]
         ↓
    Final Structured Output
```

## Output Schema

The final output follows this structure:

```python
{
    "summary": [
        {
            "layman_explanation": "Simple explanation for users",
            "technical_explanation": "Detailed legal analysis",
            "glossary": [
                {
                    "term": "Legal term",
                    "definition": "Clear definition"
                }
            ]
        }
    ],
    "risk_phrases": [
        {
            "layman_explanation": "Why this is risky for users",
            "technical_explanation": "Legal implications",
            "glossary": [
                {
                    "term": "Legal term",
                    "definition": "Clear definition"
                }
            ]
        }
    ],
    "conclusion": {
        "layman_explanation": "Overall implications for users",
        "technical_explanation": "Technical summary and recommendations",
        "glossary": [
            {
                "term": "Legal term",
                "definition": "Clear definition"
            }
        ]
    }
}
```

## Usage

The agents are designed to work with legal documents such as:
- Terms of Service
- Privacy Policies
- User Agreements
- Service Level Agreements
- End User License Agreements (EULAs)

## Key Benefits

1. **User-Friendly**: Provides simple explanations for non-legal users
2. **Comprehensive**: Includes detailed technical analysis for professionals
3. **Structured**: Outputs data in a format suitable for frontend applications
4. **Educational**: Includes glossaries to help users understand legal terminology
5. **Risk-Focused**: Specifically identifies and highlights potentially problematic clauses

## Integration

The agents are designed to be easily integrated into frontend applications where:
- Summary points can be displayed as bullet points
- Risk phrases can be highlighted in the original document
- Glossaries can be used for tooltips or help sections
- Conclusions can provide overall recommendations to users
