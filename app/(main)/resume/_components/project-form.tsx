import { improveWithAI } from "@/actions/resume";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/use-fetch";
import { projectSchema } from "@/lib/form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse } from "date-fns";
import { Code, ExternalLink, Loader2, PlusCircle, X } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { motion, AnimatePresence } from "motion/react";

type ProjectFormProps = {
  entries: z.infer<typeof projectSchema>[];
  onChange: (values: z.infer<typeof projectSchema>[]) => void;
};

const ProjectForm = ({ entries, onChange }: ProjectFormProps) => {
  const [addBtn, setAddBtn] = useState(false);

  const {
    register,
    control,
    getValues,
    setValue,
    reset,
    handleSubmit: handleValidation,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      skills: "",
      github: "",
      liveLink: "",
      startDate: "",
      endDate: "",
      current: false,
    },
  });

  const current = useWatch({ control, name: "current" });

  const {
    data: aiData,
    loading: aiLoading,
    error: aiError,
    fn: aiFunction,
  } = useFetch<Awaited<ReturnType<typeof improveWithAI>>>();

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = parse(dateString, "yyyy-MM", new Date());
    return format(date, "MMM yyyy");
  };

  const handleImproveDescription = async () => {
    const description = getValues("description");
    if (!description) {
      toast.error("Project description cannot be empty");
      return;
    }
    try {
      await aiFunction(improveWithAI, {
        type: "Project".toLowerCase(),
        currentDesc: description,
        title: getValues("title"),
        skills: getValues("skills")
          ? getValues("skills")
              .split(",")
              .map((skill) => skill.trim())
          : undefined,
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error(
          "Unknown error occurred while improving the project description",
        );
      }
    }
  };

  useEffect(() => {
    if (aiData && !aiLoading) {
      setValue("description", aiData);
      toast.success("Project description improved successfully!");
    }
    if (aiError) {
      if (aiError instanceof Error) toast.error(`Error: ${aiError.message}`);
      else
        toast.error(
          `Unknown error occurred while improving the project description`,
        );
    }
  }, [aiData, aiError, aiLoading, setValue]);

  const handleAdd = handleValidation((data) => {
    const formattedData = {
      ...data,
      startDate: formatDate(data.startDate),
      endDate: data.current ? "" : formatDate(data.endDate ?? ""),
    };

    // Add the new entry to the existing project-entries of the original resume form
    onChange([...entries, formattedData]);
    reset();
    setAddBtn(false);
  });

  const handleDelete = (index: number) => {
    onChange(
      entries.filter(
        (_: z.infer<typeof projectSchema>, i: number) => i !== index,
      ),
    );
  };

  return (
    <div className="space-y-4">
      <AnimatePresence initial={false}>
        {entries.map((entry: z.infer<typeof projectSchema>, index: number) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <Card className="bg-card border-none">
              <CardHeader className="-mb-2">
                <CardTitle className="text-lg space-y-1">
                  <div className=" flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <p>{entry.title}</p>

                      <div className="flex items-center gap-2">
                        {entry.github && (
                          <Link
                            href={entry.github}
                            className="bg-black-950 rounded-md border-y border-neutral-700 flex items-center gap-1 px-2 py-0.5 text-sm text-neutral-300 hover:text-neutral-200 transition-colors duration-150 ease-in-out"
                          >
                            <Code className="h-4 w-4" /> GitHub
                          </Link>
                        )}
                        {entry.liveLink && (
                          <Link
                            href={entry.liveLink}
                            className="bg-black-950 rounded-md border-y border-neutral-700 flex items-center gap-1 px-2 py-0.5 text-sm text-neutral-300 hover:text-neutral-200 transition-colors duration-150 ease-in-out"
                          >
                            <ExternalLink className="h-4 w-4" /> Live
                          </Link>
                        )}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant={"outline"}
                      size={"sm"}
                      className="cursor-pointer hover:border-red-800 hover:bg-red-700/10 transition-all duration-150 ease-in-out"
                      onClick={() => handleDelete(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="font-medium text-sm text-neutral-400">
                    {entry.startDate} - {entry.endDate || "Present"}
                  </p>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <p className="text-sm text-justify">{entry.description}</p>
                </div>
                <div className="flex items-center flex-wrap gap-2 mt-4">
                  {entry.skills &&
                    entry.skills.length > 0 &&
                    entry.skills.split(",").map((skill: string, i: number) => (
                      <Badge
                        key={i}
                        variant={"outline"}
                        className="border-primary/25 bg-primary/5"
                      >
                        {skill.trim()}
                      </Badge>
                    ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {addBtn && (
          <motion.div
            key="add-form"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <Card className="bg-card border-none">
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Input
                        {...register("title")}
                        placeholder="Title"
                        className="bg-background"
                      />
                      {errors.title && (
                        <p className="text-sm text-red-500">
                          {errors.title.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Input
                        {...register("skills")}
                        placeholder="Skills (comma separated)"
                        className="bg-background"
                      />
                      {errors.skills && (
                        <p className="text-sm text-red-500">
                          {errors.skills.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Input
                        {...register("github")}
                        placeholder="GitHub"
                        className="bg-background"
                      />
                      {errors.github && (
                        <p className="text-sm text-red-500">
                          {errors.github.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Input
                        {...register("liveLink")}
                        placeholder="Link"
                        className="bg-background"
                      />
                      {errors.liveLink && (
                        <p className="text-sm text-red-500">
                          {errors.liveLink.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Input
                        {...register("startDate")}
                        type="text"
                        placeholder="Start Date"
                        onFocus={(e) => (e.currentTarget.type = "month")}
                        onBlur={(e) => (e.currentTarget.type = "text")}
                        className="bg-background"
                      />
                      {errors.startDate && (
                        <p className="text-sm text-red-500">
                          {errors.startDate.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Input
                        {...register("endDate")}
                        type="text"
                        placeholder={current ? "Present" : "End Date"}
                        onFocus={(e) => (e.currentTarget.type = "month")}
                        onBlur={(e) => (e.currentTarget.type = "text")}
                        disabled={current}
                        className="bg-background"
                      />
                      {errors.endDate && !current && (
                        <p className="text-sm text-red-500">
                          {errors.endDate.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 cursor-pointer [&>*]:cursor-pointer w-min">
                    <input
                      {...register("current")}
                      id="current"
                      type="checkbox"
                      onChange={(e) => {
                        setValue("current", e.target.checked);
                        if (e.target.checked) setValue("endDate", "");
                      }}
                      className="bg-background"
                    />
                    <Label htmlFor="current">Current</Label>
                  </div>

                  <div className="space-y-2">
                    <Textarea
                      {...register("description")}
                      placeholder="Description of your project"
                      className="h-20 bg-background"
                    />

                    <Button
                      className="cursor-pointer border hover:border-primary/50 hover:bg-primary/10 transition-all duration-150 ease-in-out"
                      variant={"ghost"}
                      size={"sm"}
                      onClick={handleImproveDescription}
                      disabled={aiLoading || !getValues("description")}
                    >
                      {" "}
                      {aiLoading ? (
                        <>
                          <Loader2 className="animate-spin h-4 w-4" />
                          <p className="text-sm">Improving...</p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm">Improve with AI</p>
                        </>
                      )}
                    </Button>
                    {errors.description && (
                      <p className="text-sm text-red-500">
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant={"outline"}
                  size={"sm"}
                  className="cursor-pointer hover:border-red-800 hover:bg-red-700/10 transition-all duration-150 ease-in-out"
                  onClick={() => {
                    reset();
                    setAddBtn(false);
                  }}
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant={"outline"}
                  size={"sm"}
                  className="cursor-pointer hover:border-neutral-400 transition-all duration-150 ease-in-out"
                  onClick={handleAdd}
                >
                  <PlusCircle className="h-4 w-4" />
                  Add Project
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {!addBtn && (
        <Button
          onClick={() => {
            setAddBtn(true);
          }}
          className="cursor-pointer"
        >
          <PlusCircle className="h-4 w-4" />
          Add Project
        </Button>
      )}
    </div>
  );
};

export default ProjectForm;
