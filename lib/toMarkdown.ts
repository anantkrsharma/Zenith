export const contactToMarkdown = (contactInfo: any) => {
    const { email, mobile, linkedin } = contactInfo;
    return `
        ## Contact Information

        - **Email:** ${email}
        - **Mobile:** ${mobile}
        - **LinkedIn:** ${linkedin}
        - **Twitter:** ${contactInfo.twitter || 'N/A'}
    `;
};

export const projectsToMarkdown = (projects: any[]) => {

}

export const contentToMarkdown = (heading: string, content: any) => {

}
