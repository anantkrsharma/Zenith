import { Description } from '@radix-ui/react-dialog';
import { z } from 'zod';

//onboarding page form schema
export const onboardingSchema = z.object({
    industry: z.string({
        required_error: "Please select an industry"
    }),
    subIndustry: z.string({
        required_error: "Please select a specialization"
    }),
    bio: z.string().max(500).optional(),
    experience: z
                .string()
                .transform((val) => parseInt(val, 10))
                .pipe(
                    z
                    .number()
                    .min(0, "Experience must be at least 0 years")
                    .max(50, "Experience cannot exceed 50 years")
                ),
    skills: z
            .string()
            .transform((val) => val ? val.split(",").map((skill) => skill.trim()).filter(Boolean) : undefined)
})

//resume form schema
export const contactSchema = z.object({
    email: z.string().email("Invalid email address"),
    mobile: z
            .string()
            .optional()
            .refine(
                (val) => !val || /^\+?\d{7,15}$/.test(val),
                { message: "Invalid mobile number" }
            ),
    linkedin: z.string().optional(),
    twitter: z.string().optional()
});

export const workExpSchema = z.object({
        title: z.string().min(1, "Title is required"),
        organization: z.string().min(1, "Organization is required"),
        description: z.string().min(1, "Description is required"),
        startDate: z.string().min(1, "Start date is required"),
        endDate: z.string().optional(),
        current: z.boolean().default(false),
    })
    .refine((data) => {
        if(!data.current && !data.endDate)
            return false;
        return true;
    }, {
        message: "End date is required unless this is your current position",
        path: ["endDate"]
    })
    .refine((data) => {
        // Prevent future startDate
        if (data.startDate) {
            const now = new Date();
            const [startYear, startMonth] = data.startDate.split('-').map(Number);
            if (
                startYear > now.getFullYear() ||
                (startYear === now.getFullYear() && startMonth > (now.getMonth() + 1))
            ) {
                return false;
            }
        }
        return true;
    }, {
        message: "Start date cannot be in the future.",
        path: ["startDate"]
    })
    .refine((data) => {
        // Prevent future endDate
        if (data.endDate) {
            const now = new Date();
            const [endYear, endMonth] = data.endDate.split('-').map(Number);
            if (
                endYear > now.getFullYear() ||
                (endYear === now.getFullYear() && endMonth > (now.getMonth() + 1))
            ) {
                return false;
            }
        }
        return true;
    }, {
        message: "End date cannot be in the future. If you are currently in this position, please select 'Current' instead.",
        path: ["endDate"]
    })
    .refine((data) => {
        if (data.endDate && data.startDate) {
            // Compare as yyyy-MM
            return data.endDate >= data.startDate;
        }
        return true;
    }, {
        message: "End date cannot be earlier than start date",
        path: ["endDate"]
    })

const githubUrlRegex = /^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9_.-]+(\/[A-Za-z0-9_.-]+)?(\/)?$/;

export const projectSchema = z.object({
        title: z.string().min(1, "Title is required"),
        description: z.string().min(1, "Description is required"),
        skills: z.string().min(1, "Skills are required"),
        github: z
                .string()
                .url()
                .refine(
                    (url) => githubUrlRegex.test(url),
                    { message: "Invalid GitHub URL" }
                )
                .optional(),
        liveLink:   z
                    .string()
                    .url(),
        startDate: z.string().min(1, "Start date is required"),
        endDate: z.string().optional(),
        current: z.boolean().default(false)
    })
    .refine((data) => {
        if(!data.current && !data.endDate)
            return false;
        return true;
    }, {
        message: "End date is required unless working on the project currently",
        path: ["endDate"]
    })
    .refine((data) => {
        // Prevent future startDate
        if (data.startDate) {
            const now = new Date();
            const [startYear, startMonth] = data.startDate.split('-').map(Number);
            if (
                startYear > now.getFullYear() ||
                (startYear === now.getFullYear() && startMonth > (now.getMonth() + 1))
            ) {
                return false;
            }
        }
        return true;
    }, {
        message: "Start date cannot be in the future.",
        path: ["startDate"]
    })
    .refine((data) => {
        // Prevent future endDate
        if (data.endDate) {
            const now = new Date();
            const [endYear, endMonth] = data.endDate.split('-').map(Number);
            if (
                endYear > now.getFullYear() ||
                (endYear === now.getFullYear() && endMonth > (now.getMonth() + 1))
            ) {
                return false;
            }
        }
        return true;
    }, {
        message: "End date cannot be in the future. If you are currently working on this project, please select 'Current' instead.",
        path: ["endDate"]
    })
    .refine((data) => {
        if (data.endDate && data.startDate) {
            return data.endDate >= data.startDate;
        }
        return true;
    }, {
        message: "End date cannot be earlier than start date",
        path: ["endDate"]
    });

export const educationSchema = z.object({
        title: z.string().min(1, "Education details are required"),
        institute: z.string().min(1, "Institute is required"),
        description: z.string().optional(),
        startDate: z.string().min(1, "Start date is required"),
        endDate: z.string().optional(),
        current: z.boolean().default(false)
    })
    .refine((data) => {
        if(!data.current && !data.endDate)
            return false;
        return true;
    }, {
        message: "End date is required unless you're not studying here currently",
        path: ["endDate"]
    })
    .refine((data) => {
        // Prevent future startDate
        if (data.startDate) {
            const now = new Date();
            const [startYear, startMonth] = data.startDate.split('-').map(Number);
            if (
                startYear > now.getFullYear() ||
                (startYear === now.getFullYear() && startMonth > (now.getMonth() + 1))
            ) {
                return false;
            }
        }
        return true;
    }, {
        message: "Start date cannot be in the future.",
        path: ["startDate"]
    })
    .refine((data) => {
        // Prevent future endDate
        if (data.endDate) {
            const now = new Date();
            const [endYear, endMonth] = data.endDate.split('-').map(Number);
            if (
                endYear > now.getFullYear() ||
                (endYear === now.getFullYear() && endMonth > (now.getMonth() + 1))
            ) {
                return false;
            }
        }
        return true;
    }, {
        message: "End date cannot be in the future. If you are currently studying here, please select 'Current' instead.",
        path: ["endDate"]
    })
    .refine((data) => {
        if (data.endDate && data.startDate) {
            return data.endDate >= data.startDate;
        }
        return true;
    }, {
        message: "End date cannot be earlier than start date",
        path: ["endDate"]
    });

export const resumeSchema = z.object({
    contactInfo: contactSchema,
    summary: z.string().min(1, "Enter more details in your summary").optional(),
    skills: z.string().min(1, "Skills are required"),
    workExp: z.array(workExpSchema).optional(),
    projects: z.array(projectSchema).optional(),
    education: z.array(educationSchema).optional(),
})
