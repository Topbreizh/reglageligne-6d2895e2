
import PageLayout from "@/components/layout/PageLayout";

const LoadingScreen = () => {
  return (
    <PageLayout>
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-jaune-300"></div>
      </div>
    </PageLayout>
  );
};

export default LoadingScreen;
