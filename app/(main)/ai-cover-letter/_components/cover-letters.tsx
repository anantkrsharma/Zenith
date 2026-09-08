"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { CoverLetter } from "@prisma/client";
import CoverLetterCard from "./cover-letter-card";

const CoverLetterCards = ({
  coverLettersData,
}: {
  coverLettersData: CoverLetter[];
}) => {
  //Framer Motion variants for staggered animation
  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.12,
      },
    },
  };
  const cardVariants: import("motion/react").Variants = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        type: "spring",
        bounce: 0,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <div className="w-full">
      {coverLettersData?.length ? (
        <motion.div
          className="grid grid-cols-1 xl:grid-cols-2 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <AnimatePresence>
            {coverLettersData.map((letter) => (
              <motion.div
                key={letter.id}
                variants={cardVariants}
                initial="hidden"
                animate="show"
                exit="hidden"
                layout
              >
                <CoverLetterCard letter={letter} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[420px] text-center rounded-xl border border-dashed border-input bg-card p-8">
          <h2 className="text-2xl">Your next introduction starts here.</h2>
          <p className="text-sm text-muted-foreground max-w-sm leading-7 mt-3 mb-7">
            Create a cover letter that connects your experience to an
            opportunity you’re excited about.
          </p>
          <Button asChild>
            <Link href="/ai-cover-letter/new">Create your first letter</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default CoverLetterCards;
