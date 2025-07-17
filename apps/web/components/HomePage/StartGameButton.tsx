"use client";

import { CreateGameSessionSchema, CreateGameSessionType } from "@/lib/schema";
import { GameSessionKey } from "@/query/game/game.query";
import { createGameSession } from "@/services/game/game";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@workspace/ui/components/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

const StartGameButton = () => {
  const [open, setOpen] = useState(false);

  const form = useForm<CreateGameSessionType>({
    resolver: zodResolver(CreateGameSessionSchema),
    defaultValues: {
      player1: "",
      player2: "",
    },
  });
  console.log(form.formState.errors);
  const router = useRouter();
  const key = GameSessionKey();

  const queryClient = useQueryClient();

  const { mutate, isPending: loading } = useMutation({
    mutationFn: (data: CreateGameSessionType) => createGameSession(data),
    onSuccess: (res) => {
      form.reset();
      router.push(`/game/${res.id}`);
    },
    onError: (error) => {
      console.error(error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: key });
    },
  });

  const onSubmit = (data: CreateGameSessionType) => {
    mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Start New Game</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start a New Game</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="player1"
              render={({ field: { onChange, value } }) => (
                <FormItem>
                  <FormLabel>Player 1 Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Player 1 Name" onChange={onChange} value={value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="player2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Player 2 Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Player 1 Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit" disabled={form.formState.isSubmitting}>
              {loading ? "Starting..." : "Start"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default StartGameButton;
