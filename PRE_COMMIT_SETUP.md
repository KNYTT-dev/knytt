# Pre-Commit Hooks Setup

## ✅ Installation Complete!

Pre-commit hooks are now installed and will run automatically before every commit.

---

## 🎯 What Pre-Commit Does

Pre-commit automatically runs these checks **before** you commit:

### **Code Formatting:**
- ✅ **Black** - Auto-formats Python code
- ✅ **isort** - Sorts Python imports
- ✅ **pyupgrade** - Upgrades Python syntax

### **Code Quality:**
- ✅ **flake8** - Linting (code style)
- ✅ **mypy** - Type checking
- ✅ **bandit** - Security checks
- ✅ **pydocstyle** - Docstring checks

### **General Checks:**
- ✅ Trailing whitespace removal
- ✅ End-of-file fixer
- ✅ YAML/JSON validation
- ✅ Large files detection
- ✅ Private key detection

---

## 🚀 How It Works

### **Automatic (Recommended):**

Just commit normally:
```bash
git add .
git commit -m "your message"
```

Pre-commit will:
1. Run all checks automatically
2. **Auto-fix** formatting issues (Black, isort, etc.)
3. **Stage the fixes** for you
4. Allow commit if all checks pass

### **Manual Run:**

Run checks on all files:
```bash
pre-commit run --all-files
```

Run on specific files:
```bash
pre-commit run --files backend/api/main.py
```

---

## 🔧 Commands

### **Install hooks (already done):**
```bash
pre-commit install
```

### **Update hook versions:**
```bash
pre-commit autoupdate
```

### **Skip hooks (emergency only):**
```bash
git commit --no-verify -m "message"
```

⚠️ **Warning:** Only use `--no-verify` in emergencies. CI will still fail if code doesn't pass checks!

---

## 🐛 Common Issues

### **Issue: "File would be reformatted"**
**Solution:** Pre-commit auto-fixed it! Just `git add` the fixed files and commit again.

```bash
git add .
git commit -m "your message"
```

### **Issue: "Mypy type errors"**
**Solution:** Fix the type issues or add `# type: ignore` comments.

### **Issue: Hook takes too long**
**Solution:** Skip mypy/bandit for quick commits:
```bash
SKIP=mypy,bandit git commit -m "message"
```

---

## 📊 CI/CD Integration

Pre-commit hooks **prevent CI failures** by catching issues locally before push.

**Before Pre-Commit:**
```
Local: ❌ No checks
Push: ⬆️
CI: ❌ Fails (Black formatting, flake8 errors)
Fix: 🔧 Fix issues, push again
```

**After Pre-Commit:**
```
Local: ✅ Auto-format, lint, type-check
Commit: ✅ All checks pass
Push: ⬆️
CI: ✅ Passes immediately!
```

---

## 🎨 Black Configuration

```python
# pyproject.toml
[tool.black]
line-length = 100
target-version = ['py311']
```

---

## 📝 Example Workflow

```bash
# 1. Make changes
vim backend/api/main.py

# 2. Stage changes
git add backend/api/main.py

# 3. Commit (pre-commit runs automatically)
git commit -m "feat: add new endpoint"

# Pre-commit output:
# black....................................................................Passed
# isort....................................................................Passed
# flake8...................................................................Passed
# ✅ Commit successful!

# 4. Push
git push
```

---

## 🆘 Help

### **Disable all hooks:**
```bash
pre-commit uninstall
```

### **Re-enable hooks:**
```bash
pre-commit install
```

### **Check configuration:**
```bash
pre-commit run --all-files --verbose
```

---

## 📚 Resources

- [Pre-commit Documentation](https://pre-commit.com/)
- [Black Documentation](https://black.readthedocs.io/)
- [Our Config](.pre-commit-config.yaml)

---

**TL;DR:** Commit normally. Pre-commit auto-fixes formatting issues and prevents CI failures! 🎉

