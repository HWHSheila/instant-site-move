import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSupabase, useClerkUserId } from "./use-supabase";
import type { MemberPostType } from "@/lib/member-content-data";

export interface MemberContentPost {
  id: string;
  post_type: MemberPostType;
  title: string;
  body: string;
  status: "draft" | "published";
  tier_access: string[];
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export function useMemberContentPosts(postType: MemberPostType, adminView = true) {
  const supabase = useSupabase();

  return useQuery({
    queryKey: ["member-content-posts", postType, adminView],
    queryFn: async (): Promise<MemberContentPost[]> => {
      let query = supabase
        .from("member_content_posts" as any)
        .select("*")
        .eq("post_type", postType)
        .order("updated_at", { ascending: false });

      if (!adminView) {
        query = query.eq("status", "published");
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as MemberContentPost[];
    },
  });
}

export function useSaveMemberContentPost() {
  const supabase = useSupabase();
  const clerkUserId = useClerkUserId();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (post: Partial<MemberContentPost> & { post_type: MemberPostType; title: string }) => {
      const payload = {
        post_type: post.post_type,
        title: post.title,
        body: post.body ?? "",
        status: post.status ?? "draft",
        tier_access: post.tier_access ?? ["awareness", "foundation", "guided", "restoration", "integration"],
        published_at: post.status === "published" ? post.published_at ?? new Date().toISOString() : null,
        author_clerk_id: clerkUserId,
      };

      if (post.id) {
        const { data, error } = await supabase
          .from("member_content_posts" as any)
          .update(payload as any)
          .eq("id", post.id)
          .select()
          .single();
        if (error) throw error;
        return data as MemberContentPost;
      }

      const { data, error } = await supabase
        .from("member_content_posts" as any)
        .insert(payload as any)
        .select()
        .single();
      if (error) throw error;
      return data as MemberContentPost;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["member-content-posts", vars.post_type] });
    },
  });
}
