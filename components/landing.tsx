'use client';

import React from 'react'
import { motion } from 'framer-motion';
import { AccordionNew } from "@/components/accordionNew";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { faqs } from "@/data/faqs";
import { features } from "@/data/features";
import { howItWorks } from "@/data/howItWorks";
import { testimonial } from "@/data/testimonial";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const isMobile = () => typeof window !== 'undefined' && window.innerWidth <= 640;

const Landing = () => {
    const [mobile, setMobile] = React.useState(false);
    React.useEffect(() => {
        // Prevent horizontal scroll bar flash
        const originalOverflowX = document.body.style.overflowX;
        document.body.style.overflowX = 'hidden';
        setMobile(isMobile());
        const handleResize = () => setMobile(isMobile());
        window.addEventListener('resize', handleResize);
        return () => {
            document.body.style.overflowX = originalOverflowX;
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    return (
    <>    
        {/* Features */}
        <motion.section
            className="w-full py-12 md:py-24 lg:py-32 bg-background"
            initial={{ opacity: 0, y: 80, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.02 }}
            transition={{ type: 'spring', stiffness: 120, damping: 12, delay: 0.02 }}
        >
            <div className="container mx-auto px-4 md:px-6">
                <h2 className="text-3xl font-bold text-center tracking-tighter mb-12">
                Powerful Features for Your Career Growth
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {features.map((feature, index) => (
                    mobile ? (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.15 }}
                            transition={{ duration: 0.35, delay: index * 0.08 }}
                        >
                            <Card className="border-2 hover:border-primary transition-colors duration-300 ease-in-out shadow-lg rounded-lg">
                                <CardContent className="pt-6 text-center flex flex-col items-center">
                                    <div className="flex flex-col items-center justify-center">{feature.icon}</div>
                                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                    <p className="text-muted-foreground">{feature.description}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ) : (
                        <Card 
                            key={index}
                            className="border-2 hover:border-primary transition-colors duration-300 ease-in-out shadow-lg rounded-lg"
                        >
                            <CardContent className="pt-6 text-center flex flex-col items-center">
                                <div className="flex flex-col items-center justify-center">{feature.icon}</div>
                                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </CardContent>
                        </Card>
                    )
                ))}
                </div>
            </div>
        </motion.section>
        
        {/* Stats */}
        <motion.section
            className="w-full py-12 md:py-24 bg-muted/40"
            initial={{ opacity: 0, y: 80, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.07 }}
            transition={{ type: 'spring', stiffness: 120, damping: 12, delay: 0.04 }}
        >
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl text-center mx-auto">
                    <div className="flex flex-col items-center justify-center space-y-2">
                    <h3 className="text-4xl font-bold">50+</h3>
                    <p className="text-muted-foreground">Industries Covered</p>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center space-y-2">
                    <h3 className="text-4xl font-bold">1000+</h3>
                    <p className="text-muted-foreground">Interview Questions</p>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center space-y-2">
                    <h3 className="text-4xl font-bold">95%</h3>
                    <p className="text-muted-foreground">Success Rate</p>
                    </div>

                    <div className="flex flex-col items-center justify-center space-y-2">
                    <h3 className="text-4xl font-bold">24/7</h3>
                    <p className="text-muted-foreground">AI Support</p>
                    </div>
                </div>
            </div>
        </motion.section>
        
        {/* How it works */}
        <motion.section
            className="w-full py-12 md:py-24 bg-background"
            initial={{ opacity: 0, y: 80, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.06 }}
            transition={{ type: 'spring', stiffness: 120, damping: 12, delay: 0.06 }}
        >
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-3xl mx-auto text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">
                    How It Works
                </h2>
                <p className="text-center text-muted-foreground">
                    Four simple steps to accelerate your career growth with our AI-powered tools.
                </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {howItWorks.map((item, index) => (
                    mobile ? (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.17 }}
                            transition={{ duration: 0.35, delay: index * 0.08 }}
                            className="flex flex-col items-center justify-center text-center space-y-4"
                        >
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                {item.icon}
                            </div>
                            <h3 className="font-semibold text-xl">{item.title}</h3>
                            <p className="text-muted-foreground">{item.description}</p>
                        </motion.div>
                    ) : (
                        <div key={index} className="flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                {item.icon}
                            </div>
                            <h3 className="font-semibold text-xl">{item.title}</h3>
                            <p className="text-muted-foreground">{item.description}</p>
                        </div>
                    )
                ))}
                </div>
            </div>
        </motion.section>
        
        {/* Testimonials */}
        <motion.section
            className="w-full py-12 md:py-24 lg:py-32 bg-muted/40"
            initial={{ opacity: 0, y: 80, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.06 }}
            transition={{ type: 'spring', stiffness: 120, damping: 12, delay: 0.08 }}
        >
            <div className="container mx-auto px-4 md:px-6">
                <h2 className="text-3xl font-bold text-center tracking-tighter mb-12">
                What Our Users Say
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {testimonial.map((testimonial, index) => (
                    mobile ? (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.18 }}
                            transition={{ duration: 0.35, delay: index * 0.08 }}
                        >
                            <Card className="bg-background">
                                <CardContent className="pt-2">
                                    <div className="flex flex-col justify-center space-y-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="relative h-12 w-12 flex-shrink-0">
                                                <Image  src={testimonial.image} 
                                                        alt={testimonial.author} 
                                                        width={40} 
                                                        height={40} 
                                                        className="rounded-full object-cover border-2 border-primary/20 mx-auto mb-4"
                                                        unoptimized
                                                />
                                            </div>
                                            <div>
                                                <p className="font-semibold">{testimonial.author}</p>
                                                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                                <p className="text-sm text-primary">{testimonial.company}</p>
                                            </div>
                                        </div>
                                        <blockquote>
                                            <p className="text-muted-foreground italic relative">
                                                <span className="text-3xl text-primary absolute -top-3.5 -left-3">
                                                    &quot;
                                                </span>
                                                {testimonial.quote}
                                                <span className="text-3xl text-primary absolute -bottom-4">
                                                    &quot;
                                                </span>
                                            </p>
                                        </blockquote>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ) : (
                        <Card 
                            key={index}
                            className="bg-background"
                        >
                            <CardContent className="pt-2">
                                <div className="flex flex-col justify-center space-y-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="relative h-12 w-12 flex-shrink-0">
                                            <Image  src={testimonial.image} 
                                                    alt={testimonial.author} 
                                                    width={40} 
                                                    height={40} 
                                                    className="rounded-full object-cover border-2 border-primary/20 mx-auto mb-4"
                                                    unoptimized
                                            />
                                        </div>
                                        <div>
                                            <p className="font-semibold">{testimonial.author}</p>
                                            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                            <p className="text-sm text-primary">{testimonial.company}</p>
                                        </div>
                                    </div>
                                    <blockquote>
                                        <p className="text-muted-foreground italic relative">
                                            <span className="text-3xl text-primary absolute -top-3.5 -left-3">
                                                &quot;
                                            </span>
                                            {testimonial.quote}
                                            <span className="text-3xl text-primary absolute -bottom-4">
                                                &quot;
                                            </span>
                                        </p>
                                    </blockquote>
                                </div>
                            </CardContent>
                        </Card>
                    )
                ))}
                </div>
            </div>
        </motion.section>

        {/* FAQs */}
        <motion.section
            className="w-full py-12 md:py-24"
            initial={{ opacity: 0, y: 80, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.06 }}
            transition={{ type: 'spring', stiffness: 120, damping: 12, delay: 0.1 }}
        >
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-3xl mx-auto text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">
                    Frequently Asked Questions
                </h2>
                <p className="text-center text-muted-foreground">
                    Got questions? We have answers! Here are some common queries about Zenith.
                </p>
                </div>

                <div className="max-w-3xl mx-auto">
                    {faqs.map((item, index) => (
                    <AccordionNew title={item.question} content={item.answer} key={index} />
                    ))}
                </div>
            </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
            className="w-full"
            initial={{ opacity: 0, y: 80, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.06 }}
            transition={{ type: 'spring', stiffness: 120, damping: 12, delay: 0.12 }}
        >
            <div className="mx-auto py-24 gradient">
            <div className="flex flex-col items-center justify-center space-y-4 text-center max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl gradient-title-2">
                Ready to Accelerate Your Career?
                </h2>
                <p className="mx-auto max-w-[500px] md:max-w-[600px] text-gray-300 md:text-xl">
                Join thousands of professionals who are advancing their careers
                with AI-powered guidance.
                </p>
                <Link href="/dashboard" passHref>
                <Button
                    size="lg"
                    variant="outline"
                    className="h-11 mt-5 animate-bounce hover:cursor-pointer"
                >
                    Start Your Journey Today <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                </Link>
            </div>
            </div>
        </motion.section>
    </>
    )
}

export default Landing
