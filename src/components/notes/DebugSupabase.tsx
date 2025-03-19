import { useState, useEffect } from "react";
import { supabase } from "../../../supabase/supabase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DebugSupabase() {
  const [connectionStatus, setConnectionStatus] =
    useState<string>("Checking...");
  const [notes, setNotes] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [supabaseInfo, setSupabaseInfo] = useState({
    url: import.meta.env.VITE_SUPABASE_URL ? "Set" : "Not set",
    key: import.meta.env.VITE_SUPABASE_ANON_KEY ? "Set" : "Not set",
  });

  const checkConnection = async () => {
    try {
      setConnectionStatus("Checking...");
      setError(null);

      // Simple ping to check if Supabase is accessible
      const { data, error } = await supabase
        .from("notes")
        .select("count")
        .limit(1);

      if (error) throw error;

      setConnectionStatus("Connected");
    } catch (err: any) {
      setConnectionStatus("Failed");
      setError(err.message || "Unknown error occurred");
      console.error("Supabase connection error:", err);
    }
  };

  const fetchNotes = async () => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .limit(10);

      if (error) throw error;

      setNotes(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch notes");
      console.error("Error fetching notes:", err);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Supabase Connection Debugger</CardTitle>
        <CardDescription>
          Check your Supabase connection and view database records
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Connection Status:</span>
            <Badge
              variant={
                connectionStatus === "Connected"
                  ? "default"
                  : connectionStatus === "Checking..."
                    ? "outline"
                    : "destructive"
              }
            >
              {connectionStatus}
            </Badge>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium">VITE_SUPABASE_URL:</span>
            <Badge
              variant={supabaseInfo.url === "Set" ? "default" : "destructive"}
            >
              {supabaseInfo.url}
            </Badge>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium">VITE_SUPABASE_ANON_KEY:</span>
            <Badge
              variant={supabaseInfo.key === "Set" ? "default" : "destructive"}
            >
              {supabaseInfo.key}
            </Badge>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <p className="font-medium">Error:</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Notes Data ({notes.length})</h3>
          {notes.length > 0 ? (
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {notes.map((note) => (
                    <tr key={note.id}>
                      <td className="px-4 py-2 text-sm text-gray-500">
                        {note.id.substring(0, 8)}...
                      </td>
                      <td className="px-4 py-2 text-sm">{note.title}</td>
                      <td className="px-4 py-2 text-sm">{note.subject}</td>
                      <td className="px-4 py-2 text-sm">{note.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 italic">No notes found</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={checkConnection}>
          Check Connection
        </Button>
        <Button onClick={fetchNotes}>Fetch Notes</Button>
      </CardFooter>
    </Card>
  );
}
