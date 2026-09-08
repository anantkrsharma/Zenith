import { improveWithAI } from "@/actions/resume";
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
import { educationSchema } from "@/lib/form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse } from "date-fns";
import { Loader2, PlusCircle, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { motion, AnimatePresence } from "motion/react";

type ProjectFormProps = {
  entries: z.infer<typeof educationSchema>[];
  onChange: (value: z.infer<typeof educationSchema>[]) => void;
};

const EducationForm = ({ entries, onChange }: ProjectFormProps) => {
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
    resolver: zodResolver(educationSchema),
    defaultValues: {
      title: "",
      institute: "",
      description: "",
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
      toast.error("Education description cannot be empty");
      return;
    }
    try {
      await aiFunction(improveWithAI, {
        type: "Education".toLowerCase(),
        currentDesc: description,
        title: getValues("title"),
        organization: getValues("institute"),
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error(
          "Unknown error occurred while improving the education description",
        );
      }
    }
  };

  useEffect(() => {
    if (aiData && !aiLoading) {
      setValue("description", aiData);
      toast.success("Education description improved successfully!");
    }
    if (aiError) {
      if (aiError instanceof Error) toast.error(`Error: ${aiError.message}`);
      else
        toast.error(
          `Unknown error occurred while improving the education description`,
        );
    }
  }, [aiData, aiError, aiLoading, setValue]);

  const handleAdd = handleValidation((data) => {
    const formattedData = {
      ...data,
      startDate: formatDate(data.startDate),
      endDate: data.current ? "" : formatDate(data.endDate ?? ""),
    };

    // Add the new entry to the existing education-entries of the original resume form
    onChange([...entries, formattedData]);
    reset();
    setAddBtn(false);
  });

  const handleDelete = (index: number) => {
    onChange(
      entries.filter(
        (_: z.infer<typeof educationSchema>, i: number) => i !== index,
      ),
    );
  };

  return (
    <div className="space-y-4">
      <AnimatePresence initial={false}>
        {entries.map(
          (entry: z.infer<typeof educationSchema>, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <Card className="bg-card border-none">
                <CardHeader className="-mb-2">
                  <CardTitle className="text-lg">
                    <div className=" flex items-center justify-between">
                      <p>
                        {entry.title}{" "}
                        <span className="text-neutral-400">at</span>{" "}
                        {entry.institute}
                      </p>
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
                </CardContent>
              </Card>
            </motion.div>
          ),
        )}
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
                        {...register("institute")}
                        placeholder="Institute/University"
                        className="bg-background"
                      />
                      {errors.institute && (
                        <p className="text-sm text-red-500">
                          {errors.institute.message}
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
                      placeholder="Description of your education"
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
                  Add Education
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
          Add Education
        </Button>
      )}
    </div>
  );
};

export default EducationForm;
