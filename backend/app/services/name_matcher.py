"""Explainable, deliberately conservative comparison for user-provided names."""
from __future__ import annotations

import re
from dataclasses import dataclass


@dataclass(frozen=True)
class NameMatch:
    status: str
    explanation: str
    confidence: float


def _tokens(value: str) -> list[str]:
    return re.findall(r"[a-z]+", value.lower())


def compare_names(epfo_name: str, aadhaar_name: str) -> NameMatch:
    """Compare names without claiming identity verification.

    Initials are treated as a possible formatting difference only when all
    expanded tokens match in order. Blank input is a review, not a failure.
    """
    left, right = _tokens(epfo_name), _tokens(aadhaar_name)
    if not left or not right:
        return NameMatch("REVIEW", "One or both names were not provided, so this check needs review.", 0.0)
    if left == right:
        return NameMatch("EXACT_MATCH", "The names match after ignoring case, spaces, and punctuation.", 1.0)
    left_joined, right_joined = "".join(left), "".join(right)
    if left_joined == right_joined:
        return NameMatch("FORMATTING_DIFFERENCE", "The names differ only in spacing or punctuation.", 0.96)
    short, long = (left, right) if len(left) <= len(right) else (right, left)
    if len(short) < len(long) and all(token == other or (len(token) == 1 and other.startswith(token)) for token, other in zip(short, long)):
        return NameMatch("MINOR_DIFFERENCE", "One name appears to use an initial where the other uses a full name. Please review it.", 0.78)
    common = len(set(left) & set(right))
    if common:
        return NameMatch("POSSIBLE_MISMATCH", "The names have some similar parts but are not the same. This may need to be checked before filing.", 0.55)
    return NameMatch("POSSIBLE_MISMATCH", "The names look different. This may need to be checked before filing.", 0.2)
