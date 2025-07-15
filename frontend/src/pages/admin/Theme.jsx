import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

export default function Theme() {
  const [selectedTheme, setSelectedTheme] = useState("light");

  const themes = [
    {
      id: "light",
      name: "Light Theme",
      description: "Clean and bright interface with light colors",
      colors: {
        primary: "#46b9b0",
        background: "#ffffff",
        text: "#000000",
        sidebar: "#46b9b0"
      }
    },
    {
      id: "dark",
      name: "Dark Theme",
      description: "Modern dark interface for better eye comfort",
      colors: {
        primary: "#1f2937",
        background: "#111827",
        text: "#ffffff",
        sidebar: "#1f2937"
      }
    },
    {
      id: "blue",
      name: "Blue Theme",
      description: "Professional blue color scheme",
      colors: {
        primary: "#3b82f6",
        background: "#ffffff",
        text: "#000000",
        sidebar: "#3b82f6"
      }
    }
  ];

  const handleThemeChange = (themeId) => {
    setSelectedTheme(themeId);
    toast.success(`${themes.find(t => t.id === themeId)?.name} applied successfully!`);
  };

  const handleSaveTheme = () => {
    // Here you would typically save the theme preference to backend/localStorage
    localStorage.setItem("admin-theme", selectedTheme);
    toast.success("Theme preference saved!");
  };

  return (
    <div className="container mx-auto px-4">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-center my-4 md:my-8">
          Theme Management
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Customize the appearance of your admin dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {themes.map((theme) => (
          <Card 
            key={theme.id} 
            className={`cursor-pointer transition-all duration-300 ${
              selectedTheme === theme.id 
                ? 'ring-2 ring-primary shadow-lg' 
                : 'hover:shadow-md'
            }`}
            onClick={() => handleThemeChange(theme.id)}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {theme.name}
                {selectedTheme === theme.id && (
                  <div className="w-4 h-4 bg-primary rounded-full"></div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                {theme.description}
              </p>
              
              {/* Color Preview */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: theme.colors.primary }}
                  ></div>
                  <span className="text-xs">Primary</span>
                </div>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded border"
                    style={{ backgroundColor: theme.colors.background }}
                  ></div>
                  <span className="text-xs">Background</span>
                </div>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: theme.colors.sidebar }}
                  ></div>
                  <span className="text-xs">Sidebar</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button 
          onClick={handleSaveTheme}
          className="bg-primary text-white hover:bg-primary/90"
        >
          Save Theme Preference
        </Button>
      </div>

      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Current Theme Preview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Sidebar Preview</h4>
            <div 
              className="h-32 rounded-lg p-4 text-white"
              style={{ backgroundColor: themes.find(t => t.id === selectedTheme)?.colors.sidebar }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold" style={{ color: themes.find(t => t.id === selectedTheme)?.colors.sidebar }}>
                    S
                  </span>
                </div>
                <span className="font-bold">Surah</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                  <span>Dashboard</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                  <span>Menu</span>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Content Preview</h4>
            <div 
              className="h-32 rounded-lg p-4 border"
              style={{ 
                backgroundColor: themes.find(t => t.id === selectedTheme)?.colors.background,
                color: themes.find(t => t.id === selectedTheme)?.colors.text
              }}
            >
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 