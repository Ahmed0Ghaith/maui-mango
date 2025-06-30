import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  console.log('MAUI Mango extension is now active!');

  // Register commands
  let createXamlPage = vscode.commands.registerCommand('mauiMango.createXamlPage',
    (uri: vscode.Uri) => createXamlPageCommand(uri));

  let createXamlPageWithVM = vscode.commands.registerCommand('mauiMango.createXamlPageWithVM',
    (uri: vscode.Uri) => createXamlPageWithVMCommand(uri));

  let createViewModel = vscode.commands.registerCommand('mauiMango.createViewModel',
    (uri: vscode.Uri) => createViewModelCommand(uri));
  let createMauiProject = vscode.commands.registerCommand('mauiMango.createMauiProject',
     (Uri: vscode.Uri) => createMauiProjectCommand(Uri));

  context.subscriptions.push(createXamlPage, createXamlPageWithVM, createViewModel);
}


async function createMauiProjectCommand(uri: vscode.Uri) {
  try {
  const folderUri = await vscode.window.showOpenDialog({
    canSelectFolders: true,
    openLabel: 'Select Folder to Create Project'
  });

  if (!folderUri || folderUri.length === 0) return;

  const projectName = await vscode.window.showInputBox({
    prompt: 'Enter the project name',
    placeHolder: 'e.g., MyMauiApp'
  });

  if (!projectName) return;

  const fullPath = path.join(folderUri[0].fsPath, projectName);
  const terminal = vscode.window.createTerminal("Create MAUI Project");
  terminal.show();
  terminal.sendText(`dotnet new maui -n ${projectName} -o "${fullPath}"`);
  vscode.window.showInformationMessage(`Creating MAUI project '${projectName}'...`);
} catch (error) {
  vscode.window.showErrorMessage(`Error creating MAUI project: ${error}`);
}
}

  
async function createXamlPageCommand(uri: vscode.Uri) {
  const folderPath = uri ? uri.fsPath : getActiveWorkspaceFolder();
  if (!folderPath) return;

  const pageName = await vscode.window.showInputBox({
    prompt: 'Enter the page name (without extension)',
    placeHolder: 'e.g., MainPage, LoginPage'
  });

  if (!pageName) return;

  try {
    await createXamlFiles(folderPath, pageName);
    vscode.window.showInformationMessage(`XAML page '${pageName}' created successfully!`);
  } catch (error) {
    vscode.window.showErrorMessage(`Error creating XAML page: ${error}`);
  }
}

async function createXamlPageWithVMCommand(uri: vscode.Uri) {
  const folderPath = uri ? uri.fsPath : getActiveWorkspaceFolder();
  if (!folderPath) return;

  const pageName = await vscode.window.showInputBox({
    prompt: 'Enter the page name (without extension)',
    placeHolder: 'e.g., MainPage, LoginPage'
  });

  if (!pageName) return;

  const vmPath = await vscode.window.showInputBox({
    prompt: 'Enter the ViewModel path (relative to workspace root)',
    placeHolder: 'e.g., ViewModels, ViewModels/Pages'
  });

  if (!vmPath) return;

  try {
    await createXamlFiles(folderPath, pageName);
    await createViewModelFile(vmPath, `${pageName}ViewModel`);
    vscode.window.showInformationMessage(`XAML page '${pageName}' with ViewModel created successfully!`);
  } catch (error) {
    vscode.window.showErrorMessage(`Error creating XAML page with ViewModel: ${error}`);
  }
}

async function createViewModelCommand(uri: vscode.Uri) {
  const vmName = await vscode.window.showInputBox({
    prompt: 'Enter the ViewModel name (without ViewModel suffix)',
    placeHolder: 'e.g., Main, Login, Settings'
  });

  if (!vmName) return;

  const vmPath = await vscode.window.showInputBox({
    prompt: 'Enter the ViewModel path (relative to workspace root)',
    placeHolder: 'e.g., ViewModels, ViewModels/Pages'
  });

  if (!vmPath) return;

  try {
    await createViewModelFile(vmPath, `${vmName}ViewModel`);
    vscode.window.showInformationMessage(`ViewModel '${vmName}ViewModel' created successfully!`);
  } catch (error) {
    vscode.window.showErrorMessage(`Error creating ViewModel: ${error}`);
  }
}

async function createXamlFiles(folderPath: string, pageName: string) {
  const xamlContent = generateXamlContent(pageName);
  const csContent = generateCodeBehindContent(pageName);

  const xamlFilePath = path.join(folderPath, `${pageName}.xaml`);
  const csFilePath = path.join(folderPath, `${pageName}.xaml.cs`);

  await writeFile(xamlFilePath, xamlContent);
  await writeFile(csFilePath, csContent);

  // Open the XAML file after creation
  const document = await vscode.workspace.openTextDocument(xamlFilePath);
  await vscode.window.showTextDocument(document);
}

async function createViewModelFile(vmPath: string, vmName: string) {
  const workspaceRoot = getWorkspaceRoot();
  if (!workspaceRoot) return;

  const vmFolderPath = path.join(workspaceRoot, vmPath);
  const vmFilePath = path.join(vmFolderPath, `${vmName}.cs`);

  // Ensure directory exists
  await ensureDirectoryExists(vmFolderPath);

  const vmContent = generateViewModelContent(vmName, vmPath);
  await writeFile(vmFilePath, vmContent);

  // Open the ViewModel file after creation
  const document = await vscode.workspace.openTextDocument(vmFilePath);
  await vscode.window.showTextDocument(document);
}

function generateXamlContent(pageName: string): string {
  return `<?xml version="1.0" encoding="utf-8" ?>
<ContentPage x:Class="${getNamespace()}.${pageName}"
             xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             Title="${pageName}">
    <ScrollView>
        <VerticalStackLayout Spacing="25" Padding="30,0" VerticalOptions="Center">
            
            <Label 
                x:Name="WelcomeLabel"
                Text="Welcome to ${pageName}!"
                SemanticProperties.HeadingLevel="Level1"
                FontSize="32"
                HorizontalOptions="Center" />

            <Label 
                Text="This page was created by MAUI Mango extension"
                FontSize="18"
                HorizontalOptions="Center" />

        </VerticalStackLayout>
    </ScrollView>
</ContentPage>`;
}

function generateCodeBehindContent(pageName: string): string {
  return `using Microsoft.Maui.Controls;

namespace ${getNamespace()};

public partial class ${pageName} : ContentPage
{
    public ${pageName}()
    {
        InitializeComponent();
    }
}`;
}

function generateViewModelContent(vmName: string, vmPath: string): string {
  const namespace = getNamespaceForPath(vmPath);

  return `using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Windows.Input;
using Microsoft.Maui.Controls;

namespace ${namespace};

public class ${vmName} : INotifyPropertyChanged
{
    public event PropertyChangedEventHandler? PropertyChanged;

    protected virtual void OnPropertyChanged([CallerMemberName] string? propertyName = null)
    {
        PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
    }

    protected bool SetField<T>(ref T field, T value, [CallerMemberName] string? propertyName = null)
    {
        if (EqualityComparer<T>.Default.Equals(field, value)) return false;
        field = value;
        OnPropertyChanged(propertyName);
        return true;
    }

    // Example property
    private string _title = "${vmName.replace("ViewModel", "")}";
    public string Title
    {
        get => _title;
        set => SetField(ref _title, value);
    }

    // Example command
    public ICommand SampleCommand => new Command(OnSampleCommand);

    private void OnSampleCommand()
    {
        // Command implementation here
    }
}`;
}

function getNamespace(): string {
  const workspaceRoot = getWorkspaceRoot();
  if (!workspaceRoot) return "MauiApp";

  // Try to find project file to get namespace
  const projectFiles = fs.readdirSync(workspaceRoot).filter(f => f.endsWith('.csproj'));
  if (projectFiles.length > 0) {
    const projectName = path.basename(projectFiles[0], '.csproj');
    return projectName;
  }

  return path.basename(workspaceRoot);
}

function getNamespaceForPath(vmPath: string): string {
  const baseNamespace = getNamespace();
  const pathParts = vmPath.split(path.sep).filter(p => p.length > 0);

  if (pathParts.length === 0) {
    return baseNamespace;
  }

  return `${baseNamespace}.${pathParts.join('.')}`;
}

function getActiveWorkspaceFolder(): string | undefined {
  const activeEditor = vscode.window.activeTextEditor;
  if (activeEditor) {
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(activeEditor.document.uri);
    return workspaceFolder?.uri.fsPath;
  }

  return getWorkspaceRoot();
}

function getWorkspaceRoot(): string | undefined {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  return workspaceFolders && workspaceFolders.length > 0 ? workspaceFolders[0].uri.fsPath : undefined;
}

async function writeFile(filePath: string, content: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, 'utf8', (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

async function ensureDirectoryExists(dirPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.mkdir(dirPath, { recursive: true }, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

export function deactivate() { }