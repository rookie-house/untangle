from google.adk.agents import LlmAgent, ParallelAgent, SequentialAgent
from ...schemas import (
    RiskEvaluationResult,
    RiskPhraseResult,
    SummaryResult,
    DemistifierOutput,
)

risk_evaluator_agent = LlmAgent(
     name="risk_evaluator",
     model='gemini-2.5-flash',
     instruction="""
     You are an AI Legal Document Risk Evaluator specializing in analyzing legal documents and terms of service.
     
     Your task is to analyze the provided legal document and identify potentially risky sections that could:
     - Limit user rights or protections
     - Create liability for users
     - Allow the company to change terms unilaterally
     - Limit user recourse or dispute resolution
     - Contain broad data collection or sharing clauses
     - Include hidden fees or charges
     - Restrict user privacy or data control
     
     Analyze the document systematically and identify specific sections that pose risks to users.
     Rate the overall risk level and provide a concise summary of your findings.
     
     Focus on user protection and highlight areas where users might be disadvantaged.
     """,
     description="Analyzes legal documents and identifies risky sections that could disadvantage users.",
     output_schema=RiskEvaluationResult,
     output_key="risk_evaluator_result"
 )


risk_phrase_extractor_agent = LlmAgent(
     name="risk_phrase_extractor_agent",
     model='gemini-2.5-flash',
     instruction="""
     You are an AI Legal Phrase Extractor specializing in identifying specific risky phrases from legal documents.
     
     Based on the risk evaluation results, extract specific phrases, sentences, or clauses that contain:
     - High-risk language that limits user rights
     - Unfavorable terms for users
     - Ambiguous or unclear language that could be exploited
     - Clauses that create liability or responsibility for users
     - Terms that allow unilateral changes by the company
     - Broad data collection or sharing permissions
     - Restrictive dispute resolution clauses
     
     For each risky phrase, provide:
     - The exact text from the document
     - The section or location where it appears
     - The type of risk it represents
     - Why it's concerning for users
     
     Focus on phrases that would be highlighted on a frontend interface to warn users.
     """,
     description="Extracts specific risky phrases from legal documents for frontend highlighting.",
     output_schema=RiskPhraseResult,
     output_key="risk_phrase_extractor_result"
 )

risk_analyzer_pipeline_agent = SequentialAgent(
    name="RiskAnalyzerPipelineAgent",
    sub_agents=[risk_evaluator_agent, risk_phrase_extractor_agent],
    description="Executes a sequence of risk evaluation and risk phrase extraction.",
    # The agents will run in the order provided: Risk Evaluator -> Risk Phrase Extractor
)


summarizer_agent = LlmAgent(
     name="summarizer_agent",
     model='gemini-2.5-flash',
     instruction="""
     You are an AI Legal Document Summarizer specializing in demystifying complex legal documents.
     
     Your task is to analyze the provided legal document and create a clear, point-wise summary that:
     - Breaks down complex legal language into understandable points
     - Identifies the main sections and their purposes
     - Explains key terms and concepts in simple language
     - Highlights important user rights and obligations
     - Identifies the document type and overall complexity
     
     Create a structured summary with clear, numbered points that help users understand:
     - What the document covers
     - What users agree to by accepting
     - Key rights and responsibilities
     - Important limitations or restrictions
     - How disputes are handled
     
     Focus on making legal concepts accessible to everyday users while maintaining accuracy.
     """,
     description="Summarizes complex legal documents into clear, point-wise explanations for general users.",
     output_schema=SummaryResult,
     output_key="summarizer_result"
 )


# --- 2. Create the ParallelAgent (Runs agents concurrently) ---
# This agent orchestrates the concurrent execution of the agents.
# It finishes once all demistifier agents have completed and stored their results in state.
parallel_demistifier_agent = ParallelAgent(
     name="ParallelDemistifierAgent",
     sub_agents=[summarizer_agent, risk_analyzer_pipeline_agent],
     description="Runs multiple demistifier agents in parallel to gather information."
)


# --- 3. Define the Merger Agent (Runs *after* the parallel agents) ---
# This agent takes the results stored in the session state by the parallel agents
# and synthesizes them into a single, structured response with the required schema.
merger_agent = LlmAgent(
     name="DemistifierMergerAgent",
     model='gemini-2.5-flash',
     instruction="""
     You are an AI Legal Document Merger specializing in combining analysis results into a comprehensive, user-friendly report.
     
     Your task is to synthesize the results from the summarizer and risk analyzer agents into a structured output that includes:
     
     1. **Summary Section**: Convert the key points into structured summary points with both layman and technical explanations
     2. **Risk Phrases Section**: Transform identified risky phrases into structured format with explanations
     3. **Conclusion Section**: Provide overall assessment with both simple and technical perspectives
     
     For each section, provide:
     - **Layman Explanation**: Simple, jargon-free language for general users
     - **Technical Explanation**: Detailed legal analysis for professionals
     - **Glossary**: Relevant legal terms with clear definitions
     
     **Input Data:**
     - Summarizer Results: {summarizer_result}
     - Risk Evaluator Results: {risk_evaluator_result}
     - Risk Phrase Extractor Results: {risk_phrase_extractor_result}
     
     **Requirements:**
     - Maintain accuracy to the original analysis
     - Use clear, accessible language for layman explanations
     - Provide comprehensive technical details for legal professionals
     - Include relevant glossary terms for each section
     - Structure the output according to the specified schema
     
     Focus on creating a comprehensive resource that helps users understand legal documents while providing detailed analysis for professionals.
     """,
     description="Combines legal document analysis results into a structured, comprehensive report with layman and technical explanations.",
     output_schema=DemistifierOutput
 )

 # --- 4. Create the SequentialAgent (Orchestrates the overall flow) ---
 # This is the main agent that will be run. It first executes the ParallelAgent
 # to populate the state, and then executes the MergerAgent to produce the final output.
sequential_pipeline_agent = SequentialAgent(
     name="DemistifierPipeline",
     # Run parallel demistifier first, then merge
     sub_agents=[parallel_demistifier_agent, merger_agent],
     description="Analyzes legal documents by running summarization and risk analysis in parallel, then merges results into a comprehensive report.",
 )  

root_agent = sequential_pipeline_agent