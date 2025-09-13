from . import agent
from .schemas import (
    DemistifierOutput,
    SummaryPoint,
    RiskPhrase,
    Conclusion,
    GlossaryItem,
    RiskEvaluationResult,
    RiskPhraseResult,
    SummaryResult
)

# Export the main coordinator agent as the root agent
root_agent = agent.untangle_agent
