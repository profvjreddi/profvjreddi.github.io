# Content Management

This folder contains YAML files that control content on the website. You can edit these files directly to update the website content without needing to touch any code.

## Files

### `updates.yaml`
Controls the "Latest Updates" section shown on the home page (shows first 3 items).

## How to Edit

1. **Open the YAML file** (`updates.yaml`) in any text editor
2. **Add new updates** at the top of the list, following this exact structure:

```yaml
updates:
  - date: "YYYY-MM-DD"
    title: "Your Update Title"
    description: "Detailed description of the update. Keep it informative but concise."
    link: "https://example.com"  # Optional
    link_text: "Read more"  # Optional (only if link provided)
```

3. **Save the file** - changes will appear on the website immediately

## Required Fields

- **date**: Must be in YYYY-MM-DD format (e.g., "2024-01-15")
- **title**: Brief, descriptive title
- **description**: Detailed explanation of the update

## Optional Fields

- **link**: URL to more information (paper, event page, etc.)
- **link_text**: Text for the link (e.g., "Read paper", "View details")

## Complete Example

```yaml
updates:
  - date: "2024-01-15"
    title: "New Publication"
    description: "TinyML Benchmarking Framework accepted at ICML 2024. This work establishes standardized evaluation metrics for edge AI systems operating under severe resource constraints."
    link: "https://arxiv.org/abs/example"
    link_text: "Read paper"
    
  - date: "2023-12-20"
    title: "Speaking Engagement"
    description: "Keynote at AI Systems Conference on 'The Future of Embodied Intelligence'."
    link: ""
    link_text: ""
```

## Important Notes

- **Order matters**: Most recent updates should be at the top
- **Indentation matters**: Use exactly 2 spaces for indentation
- **Quotes required**: Always wrap text values in quotes
- **Empty fields**: Use empty quotes `""` for optional fields you don't need
- **No tabs**: Use spaces only, never tabs
- **Home page only**: Updates appear in a compact preview on the home page

## Tips

- Test your YAML syntax with an online YAML validator if you're unsure
- Keep descriptions clear and informative (will be truncated to ~80 characters on home page)
- Use consistent date formatting
- Include links when you want visitors to read more or access related content 