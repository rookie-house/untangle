from google.adk.agents import LlmAgent
from .tools.get_user_data import get_user_data
from google.adk.models.lite_llm import LiteLlm

conversation_agent = LlmAgent(
     model=LiteLlm(
        model="gpt-4o-mini",
        response_format={"type": "text"},
        force_json=False,
        temperature=0.1,
     ),
    name='ConversationAgent',
    description='A conversational AI agent that engages with users about questions related to their memory context and stored information.',
    instruction="""
    You are a conversational AI assistant specialized in helping users understand and discuss information from their memory context.
    
    Your primary role is to:
    - Answer questions about specific items in the user's memory context
    - Provide clarifications and explanations about stored information
    - Help users navigate and understand their personal data
    - Engage in meaningful conversations about their stored content
    
    When responding:
    - Reference specific information from the user's memory context when relevant
    - Use the get_user_data tool to access user information when needed
    - Provide clear, helpful explanations
    - Ask follow-up questions if you need more context
    - Be conversational and friendly while staying informative
    
    Focus on helping users make sense of their stored information and answer their specific questions about it.
    """,
    tools=[get_user_data],
)
