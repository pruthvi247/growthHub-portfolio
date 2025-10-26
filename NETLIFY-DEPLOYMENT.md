# Netlify Deployment Checklist for GrowthHub Portfolio

## Pre-Deployment Checklist

### ✅ File Structure

- [ ] All files are in root directory
- [ ] `articles/` folder exists with all JSON files
- [ ] `netlify.toml` configuration file is present
- [ ] No file:// protocol dependencies

### ✅ Article Files

Ensure these files exist in `articles/` folder:

- [ ] strategic-planning.json
- [ ] content-creation.json
- [ ] crisis-management.json
- [ ] performance-analytics.json
- [ ] door-to-door-campaigns.json
- [ ] video-production.json
- [ ] social-media-content.json
- [ ] voter-analysis.json
- [ ] community-events.json

### ✅ Configuration Files

- [ ] `netlify.toml` - Netlify configuration
- [ ] `_redirects` - URL redirects (if needed)
- [ ] CORS headers configured for JSON files

## Deployment Steps

1. **Zip the entire project folder**

   ```bash
   zip -r growthhub-portfolio.zip . -x "*.git*" "node_modules/*" "*.DS_Store*"
   ```

2. **Upload to Netlify**

   - Go to Netlify dashboard
   - Drag and drop the zip file or connect Git repository
   - Netlify will automatically detect static site

3. **Verify Deployment**
   - Check that `https://your-site.netlify.app/articles/strategic-planning.json` is accessible
   - Test blog article loading on deployed site
   - Verify all paths work correctly

## Testing After Deployment

### ✅ Article Loading Test

- [ ] Visit blogs page: `https://your-site.netlify.app/blogs.html`
- [ ] Click on article cards
- [ ] Verify articles load from JSON files (not embedded data)
- [ ] Check browser console for success messages

### ✅ Path Resolution Test

- [ ] Direct JSON access: `/articles/strategic-planning.json`
- [ ] Relative paths work from blogs page
- [ ] No CORS errors in console

## Troubleshooting

### If Articles Don't Load:

1. Check browser console for error messages
2. Verify JSON files are accessible at: `your-site.netlify.app/articles/filename.json`
3. Check Netlify deploy log for missing files
4. Ensure `netlify.toml` is properly configured

### Common Issues:

- **404 on JSON files**: Check file names and case sensitivity
- **CORS errors**: Verify `netlify.toml` headers configuration
- **Path resolution**: Ensure relative paths are correct

## Success Indicators

When properly deployed, you should see:

- ✅ "Article loaded successfully from JSON file" in console
- ✅ Articles open with full content
- ✅ No fallback to embedded data
- ✅ Fast loading from Netlify CDN

## Local Testing Before Deployment

Test locally with web server:

```bash
cd /path/to/growthhub-portfolio
python3 -m http.server 8000
# Visit: http://localhost:8000/blogs.html
```

This should replicate Netlify behavior for final verification.
