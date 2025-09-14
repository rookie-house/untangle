from typing import List, Dict, Any
from pydantic import BaseModel, Field, ConfigDict
import json

def remove_additional_properties(schema: dict) -> dict:
    """Remove additionalProperties from schema and all nested schemas"""
    if isinstance(schema, dict):
        # Remove additionalProperties from current level
        schema = {k: v for k, v in schema.items() if k != 'additionalProperties'}
        
        # Recursively process nested schemas
        for key, value in schema.items():
            if isinstance(value, dict):
                schema[key] = remove_additional_properties(value)
            elif isinstance(value, list):
                schema[key] = [remove_additional_properties(item) if isinstance(item, dict) else item for item in value]
    return schema

class BaseSchema(BaseModel):
    """Base schema class that removes additionalProperties from JSON schema"""
    model_config = ConfigDict(extra='allow')
    
    @classmethod
    def model_json_schema(cls, **kwargs):
        """Override to remove additionalProperties from generated schema"""
        schema = super().model_json_schema(**kwargs)
        return remove_additional_properties(schema)

class GlossaryItem(BaseSchema):
    """Individual glossary item with term and definition"""
    term: str = Field(description="The legal or technical term")
    definition: str = Field(description="Clear definition of the term")

class SummaryPoint(BaseSchema):
    """Individual summary point with layman and technical explanations"""
    layman_explanation: str = Field(description="Simple, easy-to-understand explanation for general users")
    technical_explanation: str = Field(description="Detailed technical explanation for legal professionals")
    glossary: List[GlossaryItem] = Field(description="List of terms and definitions relevant to this point")

class RiskPhrase(BaseSchema):
    """Individual risk phrase with explanations"""
    layman_explanation: str = Field(description="Simple explanation of why this phrase is risky for users")
    technical_explanation: str = Field(description="Technical analysis of the legal implications")
    glossary: List[GlossaryItem] = Field(description="List of terms and definitions relevant to this risk")

class Conclusion(BaseSchema):
    """Overall conclusion with explanations"""
    layman_explanation: str = Field(description="Simple summary of the document's key implications for users")
    technical_explanation: str = Field(description="Technical summary of legal implications and recommendations")
    glossary: List[GlossaryItem] = Field(description="List of terms and definitions relevant to the conclusion")

class DemistifierOutput(BaseSchema):
    """Complete output schema for the demistifier agent pipeline"""
    summary: List[SummaryPoint] = Field(description="Point-wise summary of the legal document")
    risk_phrases: List[RiskPhrase] = Field(description="Array of risky phrases found in the document")
    conclusion: Conclusion = Field(description="Overall conclusion and recommendations")

# Individual agent output schemas
class RiskEvaluationResult(BaseSchema):
    """Output schema for risk evaluator agent"""
    risky_sections: List[str] = Field(description="List of identified risky sections from the document")
    risk_level: str = Field(description="Overall risk level: Low, Medium, High, Critical")
    risk_summary: str = Field(description="Brief summary of identified risks")

class PhraseItem(BaseSchema):
    """Individual phrase item with location and risk type"""
    phrase: str = Field(description="The exact risky phrase from the document")
    location: str = Field(description="Section or location where the phrase appears")
    risk_type: str = Field(description="Type of risk this phrase represents")

class RiskPhraseResult(BaseSchema):
    """Output schema for risk phrase extractor agent"""
    phrases: List[PhraseItem] = Field(description="Array of risky phrases with their locations and risk types")

class SummaryResult(BaseSchema):
    """Output schema for summarizer agent"""
    key_points: List[str] = Field(description="List of key summary points")
    document_type: str = Field(description="Type of legal document (terms of service, privacy policy, etc.)")
    complexity_level: str = Field(description="Document complexity level: Simple, Moderate, Complex")
