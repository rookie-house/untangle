from typing import List, Dict, Any
from pydantic import BaseModel, Field, ConfigDict

class GlossaryItem(BaseModel):
    """Individual glossary item with term and definition"""
    model_config = ConfigDict(extra='forbid')
    
    term: str = Field(description="The legal or technical term")
    definition: str = Field(description="Clear definition of the term")

class SummaryPoint(BaseModel):
    """Individual summary point with layman and technical explanations"""
    model_config = ConfigDict(extra='forbid')
    
    layman_explanation: str = Field(description="Simple, easy-to-understand explanation for general users")
    technical_explanation: str = Field(description="Detailed technical explanation for legal professionals")
    glossary: List[GlossaryItem] = Field(description="List of terms and definitions relevant to this point")

class RiskPhrase(BaseModel):
    """Individual risk phrase with explanations"""
    model_config = ConfigDict(extra='forbid')
    
    layman_explanation: str = Field(description="Simple explanation of why this phrase is risky for users")
    technical_explanation: str = Field(description="Technical analysis of the legal implications")
    glossary: List[GlossaryItem] = Field(description="List of terms and definitions relevant to this risk")

class Conclusion(BaseModel):
    """Overall conclusion with explanations"""
    model_config = ConfigDict(extra='forbid')
    
    layman_explanation: str = Field(description="Simple summary of the document's key implications for users")
    technical_explanation: str = Field(description="Technical summary of legal implications and recommendations")
    glossary: List[GlossaryItem] = Field(description="List of terms and definitions relevant to the conclusion")

class DemistifierOutput(BaseModel):
    """Complete output schema for the demistifier agent pipeline"""
    model_config = ConfigDict(extra='forbid')
    
    summary: List[SummaryPoint] = Field(description="Point-wise summary of the legal document")
    risk_phrases: List[RiskPhrase] = Field(description="Array of risky phrases found in the document")
    conclusion: Conclusion = Field(description="Overall conclusion and recommendations")

# Individual agent output schemas
class RiskEvaluationResult(BaseModel):
    """Output schema for risk evaluator agent"""
    model_config = ConfigDict(extra='forbid')
    
    risky_sections: List[str] = Field(description="List of identified risky sections from the document")
    risk_level: str = Field(description="Overall risk level: Low, Medium, High, Critical")
    risk_summary: str = Field(description="Brief summary of identified risks")

class RiskPhraseResult(BaseModel):
    """Output schema for risk phrase extractor agent"""
    model_config = ConfigDict(extra='forbid')
    
    phrases: List[Dict[str, str]] = Field(description="Array of risky phrases with their locations and risk types")

class SummaryResult(BaseModel):
    """Output schema for summarizer agent"""
    model_config = ConfigDict(extra='forbid')
    
    key_points: List[str] = Field(description="List of key summary points")
    document_type: str = Field(description="Type of legal document (terms of service, privacy policy, etc.)")
    complexity_level: str = Field(description="Document complexity level: Simple, Moderate, Complex")
