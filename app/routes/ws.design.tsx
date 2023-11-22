import { z } from 'zod';

import { useFetcher, useLoaderData } from '@remix-run/react';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Label } from '~/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Textarea } from '~/components/ui/textarea';

import { type ActionFunctionArgs, json } from '@remix-run/node';
import { Input } from '~/components/ui/input';

// import { createClient } from "@supabase/supabase-js";

// export const loader = async ({ params }: LoaderFunctionArgs) => {
//   const supabase = createClient(
//     process.env.SUPABASE_URL!,
//     process.env.SUPABASE_ANON_KEY!
//   );
//   const { data } = await supabase.from("test").select();
//   return { data };
// }

const sk2imgSchema = z.object({
  style: z.string().min(1),
  type: z.string().min(1),
  prompt: z.string(),
  image: z.instanceof(File),
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const ret = sk2imgSchema.safeParse(Object.fromEntries(formData.entries()));
  if (ret.success) {
    const blob = await ret.data.image.arrayBuffer();
    console.log('image size', blob.byteLength);
  } else {
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    console.log(ret.error);
  }
  return json({ ok: true });
}

export default function () {
  const fetcher = useFetcher();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    fetcher.submit(formData);
  };

  return (
    <div className="grid p-6">
      <Card className="mr-auto">
        <CardHeader>
          <CardTitle>Sketch Render</CardTitle>
          <CardDescription>Render a sketch image</CardDescription>
        </CardHeader>
        <CardContent>
          <fetcher.Form
            className="grid gap-6"
            method="post"
            encType="multipart/form-data"
            onSubmit={handleSubmit}
          >
            <div className="grid gap-2">
              <Label htmlFor="style">Style</Label>
              <Select name="style" defaultValue="modern">
                <SelectTrigger id="style">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="traditional">Traditional</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <Select name="type" defaultValue="kitchen">
                <SelectTrigger
                  id="type"
                  // className="line-clamp-1 w-[160px] truncate"
                >
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dining">Dining Room</SelectItem>
                  <SelectItem value="bedroom">Bedroom</SelectItem>
                  <SelectItem value="kitchen">Kitchen</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="prompt">Design ideas</Label>
              <Textarea
                id="prompt"
                name="prompt"
                placeholder="Describe your design ideas"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image">Image</Label>
              <Input id="image" name="image" type="file" />
            </div>
            <Button type="submit" className="mx-auto justify-self-center">
              Generate
            </Button>
          </fetcher.Form>
        </CardContent>
      </Card>
    </div>
  );
}
