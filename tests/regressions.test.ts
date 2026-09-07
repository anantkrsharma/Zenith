import assert from "node:assert/strict";
import test from "node:test";
import { resolveResumeDraft } from "../lib/resume-draft";

test("manual resume edits survive preview toggles and regenerate only when the form changes", () => {
  const draft = { source: "original form", content: "Edited resume" };
  assert.equal(
    resolveResumeDraft(draft, "original form", "Generated resume"),
    "Edited resume",
  );
  assert.equal(
    resolveResumeDraft(draft, "updated form", "Updated resume"),
    "Updated resume",
  );
  assert.equal(
    resolveResumeDraft(
      { ...draft, content: "" },
      "original form",
      "Generated resume",
    ),
    "",
  );
  assert.equal(
    resolveResumeDraft(null, "original form", "Saved resume"),
    "Saved resume",
  );
});
import {
  industryInsightsSchema,
  interviewQuestionsSchema,
} from "../lib/ai-schema";
import {
  contactSchema,
  onboardingSchema,
  workExpSchema,
} from "../lib/form-schema";
import {
  contactToMarkdown,
  workExpToMarkdown,
  projectsToMarkdown,
  educationToMarkdown,
} from "../lib/toMarkdown";

test("AI insights reject malformed values before they reach the database", () => {
  const valid = {
    salaryRanges: [{ role: "Designer", min: 50000, median: 70000, max: 90000 }],
    growthRate: 4.5,
    demandLevel: "High",
    marketOutlook: "POSITIVE",
    topSkills: ["Research"],
    keyTrends: ["Design systems"],
    recommendedSkills: ["Strategy"],
  };
  assert.equal(
    industryInsightsSchema.parse(valid).salaryRanges[0].median,
    70000,
  );
  assert.equal(
    industryInsightsSchema.safeParse({ ...valid, growthRate: "fast" }).success,
    false,
  );
  assert.equal(
    industryInsightsSchema.safeParse({ ...valid, marketOutlook: "unknown" })
      .success,
    false,
  );
  assert.equal(
    industryInsightsSchema.safeParse({ ...valid, salaryRanges: [] }).success,
    false,
  );
});

test("AI interview questions require four options and an answer that is one of them", () => {
  const question = {
    question: "Choose a language",
    options: ["TypeScript", "A", "B", "C"],
    correctAnswer: "TypeScript",
    explanation: "TypeScript is a programming language.",
  };
  assert.equal(
    interviewQuestionsSchema.parse({ questions: [question] }).questions.length,
    1,
  );
  assert.equal(
    interviewQuestionsSchema.safeParse({
      questions: [{ ...question, correctAnswer: "D" }],
    }).success,
    false,
  );
  assert.equal(
    interviewQuestionsSchema.safeParse({
      questions: [{ ...question, options: ["A"] }],
    }).success,
    false,
  );
});

test("onboarding continues to normalize experience and comma-separated skills", () => {
  const result = onboardingSchema.parse({
    industry: "technology",
    subIndustry: "Software",
    experience: "4",
    skills: "React, TypeScript, , SQL",
  });
  assert.equal(result.experience, 4);
  assert.deepEqual(result.skills, ["React", "TypeScript", "SQL"]);
  assert.equal(
    onboardingSchema.safeParse({
      industry: "technology",
      subIndustry: "Software",
      experience: "51",
      skills: "",
    }).success,
    false,
  );
});

test("contact validation retains optional phone support and rejects invalid email", () => {
  assert.equal(
    contactSchema.safeParse({ email: "alex@example.com", mobile: "" }).success,
    true,
  );
  assert.equal(contactSchema.safeParse({ email: "invalid" }).success, false);
});

test("resume contact rendering preserves headings and profile links", () => {
  assert.equal(contactToMarkdown("Alex", { email: "" }), "");
  const markdown = contactToMarkdown("Alex", {
    email: "alex@example.com",
    linkedin: "https://linkedin.com/in/alex",
  });
  assert.match(markdown, /Alex/);
  assert.match(markdown, /alex@example.com/);
  assert.match(markdown, /\[LinkedIn\]\(https:\/\/linkedin.com\/in\/alex\)/);
});

test("empty resume sections stay omitted and current roles display Present", () => {
  assert.equal(workExpToMarkdown([]), "");
  assert.equal(projectsToMarkdown([]), "");
  assert.equal(educationToMarkdown([]), "");
  const markdown = workExpToMarkdown([
    {
      title: "Engineer",
      organization: "Example",
      startDate: "Jan 2020",
      current: true,
      description: "Built useful software.",
    },
  ]);
  assert.match(markdown, /## Work Experience/);
  assert.match(markdown, /Jan 2020 - Present/);
  assert.match(markdown, /Built useful software\./);
});

test("experience validation still rejects a future start date", () => {
  assert.equal(
    workExpSchema.safeParse({
      title: "Engineer",
      organization: "Example",
      description: "Experience",
      startDate: "2999-01",
      endDate: "",
      current: true,
    }).success,
    false,
  );
});
