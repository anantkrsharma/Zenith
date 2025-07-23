import { contactSchema, workExpSchema, projectSchema, educationSchema } from "./form-schema";
import { z } from "zod";

export const contactToMarkdown = (userInfo: string, contactInfo: z.infer<typeof contactSchema>) => {
    const { email, mobile, linkedin, twitter } = contactInfo;
    
    const parts = [];
    if (email) parts.push(`${email}`);
    if (mobile) parts.push(`${mobile}`);
    if (linkedin) parts.push(`[LinkedIn](${linkedin})`);
    if (twitter) parts.push(`[Twitter](${twitter})`);

    return parts.length > 0
        ? `## <div align="center">${userInfo}</div>
            \n\n<div align="center">\n\n${parts.join(" | ")}\n\n</div>`
        : "";
};

export const workExpToMarkdown = (workExp: z.infer<typeof workExpSchema>[]) => {
    if(!workExp || workExp.length === 0) return "";

    const mdArray = workExp.map((item) => {
        const dateRange = item.current ? `${item.startDate} - Present` : `${item.startDate} - ${item.endDate}`;

        return `### ${item.title} at ${item.organization}\n**${dateRange}**\n\n${item.description}`;
    });

    return `## Work Experience\n\n` + mdArray.join("\n\n");
};

export const projectsToMarkdown = (projects: z.infer<typeof projectSchema>[]) => {
    if (!projects || projects.length === 0) return "";
    
    const mdArray = projects.map((project) => {
        const dateRange = project.current ? `${project.startDate} - Present` : `${project.startDate} - ${project.endDate}`;
        const githubLink = project.github ? `**GitHub:** [Code](${project.github}) ◦` : "";
        const liveLink = project.liveLink ? `**Live Link:** [Try it out](${project.liveLink})` : "";
        const skills = project.skills ? `**Skills:** ${project.skills}` : "";
        
        return `### ${project.title}\n${dateRange}\n\n${githubLink}\n${liveLink}\n\n${project.description}\n\n${skills}`;
    });
    
    return `## Projects\n\n` + mdArray.join("\n\n");
}

export const educationToMarkdown = (education: z.infer<typeof educationSchema>[]) => {
    if (!education || education.length === 0) return "";

    const mdArray = education.map((item) => {
        const dateRange = item.current ? `${item.startDate} - Present` : `${item.startDate} - ${item.endDate}`;
        return `### ${item.title} from ${item.institute}\n**${dateRange}**\n\n${item.description}`;
    });

    return `## Education\n\n` + mdArray.join("\n\n");
};
