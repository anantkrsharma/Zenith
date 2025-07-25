import { z } from 'zod';

// onboarding and contact schemas unchanged
export const onboardingSchema = z.object({
    industry: z.string({ required_error: "Please select an industry" }),
    subIndustry: z.string({ required_error: "Please select a specialization" }),
    bio: z.string().max(500).optional(),
    experience: z.string().transform(v => parseInt(v, 10))
        .pipe(z.number().min(0, "Experience must be at least 0 years").max(50, "Experience cannot exceed 50 years")),
    skills: z.string().transform(v => v ? v.split(',').map(s => s.trim()).filter(Boolean) : undefined)
});

export const contactSchema = z.object({
    email: z.string().email("Invalid email address"),
    mobile: z.string().optional().refine(v => !v || /^\+?\d{7,15}$/.test(v), { message: "Invalid mobile number" }),
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
});

function parseYearMonth(s: string) {
    const [year, month] = s.split('-').map(Number);
    return { year, month };
}
function isFuture({ year, month }: { year: number, month: number }) {
    const now = new Date();
    return year > now.getFullYear() || (year === now.getFullYear() && month > now.getMonth() + 1);
}
function monthsDiff(from: { year: number, month: number }, to: { year: number, month: number }) {
    return (to.year - from.year) * 12 + (to.month - from.month);
}

export const workExpSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    organization: z.string().min(1, { message: "Organization is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    startDate: z.string().min(1, { message: "Start date is required" }),
    endDate: z.string().optional(),
    current: z.boolean().default(false),
})
.superRefine((data, ctx) => {
    const now = new Date();
    const currentYM = { year: now.getFullYear(), month: now.getMonth() + 1 };
    const sd = parseYearMonth(data.startDate);

    if (!data.current && !data.endDate) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['endDate'], message: "End date is required unless this is your current position" });
    }

    if (isFuture(sd)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['startDate'], message: "Start date cannot be in the future." });
    }

    if (data.endDate) {
    const ed = parseYearMonth(data.endDate);

    if (isFuture(ed)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['endDate'], message: "End date cannot be in the future. If you are currently in this position, please select 'Current'." });
    }

    const diff = monthsDiff(sd, ed);
    const isRecent = ed.year === currentYM.year && (ed.month === currentYM.month || ed.month === currentYM.month - 1);

    if (diff < 0 && !(isRecent && diff >= -2)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['endDate'], message: "End date cannot be earlier than start date" });
    }
    }
});

export const projectSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    skills: z.string().min(1, { message: "Skills are required" }),
    github: z.string().url().refine(
    url => /^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9_.-]+(\/[A-Za-z0-9_.-]+)?\/?$/.test(url),
    { message: "Invalid GitHub URL" }
    ).optional(),
    liveLink: z.string().url().optional(),
    startDate: z.string().min(1, { message: "Start date is required" }),
    endDate: z.string().optional(),
    current: z.boolean().default(false),
})
.superRefine((data, ctx) => {
    const now = new Date();
    const currentYM = { year: now.getFullYear(), month: now.getMonth() + 1 };
    const sd = parseYearMonth(data.startDate);

    if (!data.current && !data.endDate) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['endDate'], message: "End date is required unless working on the project currently" });
    }

    if (isFuture(sd)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['startDate'], message: "Start date cannot be in the future." });
    }

    if (data.endDate) {
    const ed = parseYearMonth(data.endDate);

    if (isFuture(ed)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['endDate'], message: "End date cannot be in the future. If you are currently working on this project, please select 'Current'." });
    }

    const diff = monthsDiff(sd, ed);
    const isRecent = ed.year === currentYM.year && (ed.month === currentYM.month || ed.month === currentYM.month - 1);

    if (diff < 0 && !(isRecent && diff >= -2)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['endDate'], message: "End date cannot be earlier than start date" });
    }
    }
});

export const educationSchema = z.object({
    title: z.string().min(1, { message: "Education details are required" }),
    institute: z.string().min(1, { message: "Institute is required" }),
    description: z.string().optional(),
    startDate: z.string().min(1, { message: "Start date is required" }),
    endDate: z.string().optional(),
    current: z.boolean().default(false),
})
.superRefine((data, ctx) => {
    const now = new Date();
    const currentYM = { year: now.getFullYear(), month: now.getMonth() + 1 };
    const sd = parseYearMonth(data.startDate);

    if (!data.current && !data.endDate) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['endDate'], message: "End date is required unless you're currently studying here" });
    }

    if (isFuture(sd)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['startDate'], message: "Start date cannot be in the future." });
    }

    if (data.endDate) {
    const ed = parseYearMonth(data.endDate);

    if (isFuture(ed)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['endDate'], message: "End date cannot be in the future. If you are currently studying here, please select 'Current'." });
    }

    const diff = monthsDiff(sd, ed);
    const isRecent = ed.year === currentYM.year && (ed.month === currentYM.month || ed.month === currentYM.month - 1);

    if (diff < 0 && !(isRecent && diff >= -2)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['endDate'], message: "End date cannot be earlier than start date" });
    }
    }
})

export const resumeSchema = z.object({
    contactInfo: contactSchema,
    summary: z.string().min(1, "Enter more details in your summary").optional(),
    skills: z.string().min(1, "Skills are required"),
    workExp: z.array(workExpSchema).optional(),
    projects: z.array(projectSchema).optional(),
    education: z.array(educationSchema).optional(),
});
