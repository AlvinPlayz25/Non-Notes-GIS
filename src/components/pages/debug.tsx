import DebugSupabase from "../notes/DebugSupabase";
import PageLayout from "../layout/PageLayout";

export default function DebugPage() {
  return (
    <PageLayout>
      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-blue-900 mb-6">
            Supabase Debug Page
          </h1>
          <DebugSupabase />
        </div>
      </div>
    </PageLayout>
  );
}
