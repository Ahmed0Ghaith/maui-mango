# MAUI Mango

A VS Code extension that simplifies .NET MAUI development by providing quick commands to create XAML pages with code-behind files and ViewModels.

## Features

- **Create XAML Page with Code-behind**: Quickly generate a XAML file with its corresponding `.xaml.cs` code-behind file
- **Create XAML Page with ViewModel**: Generate a XAML page, code-behind, and ViewModel in one command
- **Create ViewModel**: Generate a standalone ViewModel class with proper MVVM implementation
- **Smart Namespace Detection**: Automatically detects project namespace from `.csproj` files
- **Context Menu Integration**: Right-click on folders in the Explorer to access commands
- **Command Palette Support**: All commands available through VS Code's command palette

## Usage

### Method 1: Context Menu (Right-click)
1. Right-click on any folder in the VS Code Explorer
2. Select one of the MAUI Mango options:
   - "Create XAML Page with Code-behind"
   - "Create XAML Page with Code-behind and ViewModel"
   - "Create ViewModel"

### Method 2: Command Palette
1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type "MAUI Mango" to see available commands
3. Select the desired command

## Commands

### Create XAML Page with Code-behind
- **Command**: `MAUI Mango: Create XAML Page with Code-behind`
- Creates a XAML file and its corresponding `.xaml.cs` code-behind file
- Prompts for page name (e.g., "MainPage", "LoginPage")

### Create XAML Page with Code-behind and ViewModel
- **Command**: `MAUI Mango: Create XAML Page with Code-behind and ViewModel`
- Creates XAML, code-behind, and ViewModel files
- Prompts for page name and ViewModel path
- ViewModel path is relative to workspace root (e.g., "ViewModels", "ViewModels/Pages")

### Create ViewModel
- **Command**: `MAUI Mango: Create ViewModel`
- Creates a standalone ViewModel class
- Prompts for ViewModel name and path
- Includes proper MVVM implementation with INotifyPropertyChanged

## Generated Files

### XAML File
```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage x:Class="YourApp.PageName"
             xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             Title="PageName">
    <!-- Content with welcome message -->
</ContentPage>
```

### Code-behind File
```csharp
using Microsoft.Maui.Controls;

namespace YourApp;

public partial class PageName : ContentPage
{
    public PageName()
    {
        InitializeComponent();
    }
}
```

### ViewModel File
```csharp
using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Windows.Input;
using Microsoft.Maui.Controls;

namespace YourApp.ViewModels;

public class PageNameViewModel : INotifyPropertyChanged
{
    // Full MVVM implementation with PropertyChanged events
    // Example properties and commands included
}
```

## Requirements

- VS Code 1.74.0 or higher
- .NET MAUI project (the extension works in any workspace but generates MAUI-specific code)

## Installation

### From Source
1. Clone or download this extension
2. Open the extension folder in VS Code
3. Run `npm install` to install dependencies
4. Press `F5` to run the extension in a new Extension Development Host window

### Building VSIX Package
1. Install vsce: `npm install -g vsce`
2. Run `vsce package` to create a `.vsix` file
3. Install the extension using `code --install-extension maui-mango-1.0.0.vsix`

## Contributing

Feel free to contribute to this extension by:
- Reporting bugs
- Suggesting new features
- Submitting pull requests

## License

This extension is provided as-is for educational and development purposes.

## Changelog

### 1.0.0
- Initial release
- Create XAML pages with code-behind
- Create XAML pages with ViewModels
- Create standalone ViewModels
- Context menu integration
- Command palette support
- Smart namespace detection