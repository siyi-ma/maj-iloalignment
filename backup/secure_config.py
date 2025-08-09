"""
Secure Configuration Management for PLO-MLO Analysis
Handles API keys and sensitive configuration securely
"""

import os
from typing import Optional
import json
from pathlib import Path

class SecureConfig:
    """
    Secure configuration manager that loads API keys and settings
    from multiple sources in order of priority:
    1. Environment variables
    2. .env file  
    3. Config file
    4. Default values
    """
    
    def __init__(self, project_root: Optional[str] = None):
        self.project_root = Path(project_root) if project_root else Path(__file__).parent
        self.config = {}
        self.domain_terms = None
        self.load_configuration()
        self.load_domain_terms()
    def load_domain_terms(self):
        """Load domain terms from domain_terms.json"""
        domain_terms_path = self.project_root.parent / "data" / "domain_terms.json"
        if domain_terms_path.exists():
            try:
                with open(domain_terms_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self.domain_terms = data.get("domainTerms", [])
                print("OK: Loaded domain terms from domain_terms.json")
            except Exception as e:
                print(f"Warning: Could not read domain_terms.json: {e}")
                self.domain_terms = []
        else:
            print("Warning: domain_terms.json not found")
            self.domain_terms = []

    def get_domain_terms(self):
        """Get loaded domain terms as a list of dicts"""
        if self.domain_terms is None:
            self.load_domain_terms()
        return self.domain_terms
    
    def load_configuration(self):
        """Load configuration from all available sources"""
        # 1. Load from .env file first
        self._load_from_env_file()
        
        # 2. Override with environment variables (highest priority)
        self._load_from_environment()
        
        # 3. Set defaults for missing values
        self._set_defaults()
    
    def _load_from_env_file(self):
        """Load configuration from .env file"""
        env_file = self.project_root / '.env'
        
        if env_file.exists():
            try:
                with open(env_file, 'r', encoding='utf-8') as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith('#') and '=' in line:
                            key, value = line.split('=', 1)
                            # Remove quotes if present
                            value = value.strip('"\'')
                            self.config[key.strip()] = value
                print("OK: Loaded configuration from .env file")
            except Exception as e:
                print(f"Warning: Could not read .env file: {e}")
    
    def _load_from_environment(self):
        """Load configuration from environment variables"""
        env_vars = [
            'LANGEXTRACT_API_KEY',
            'GEMINI_API_KEY', 
            'OPENAI_API_KEY',
            'FLASK_DEBUG',
            'FLASK_HOST',
            'FLASK_PORT'
        ]
        
        for var in env_vars:
            if var in os.environ:
                self.config[var] = os.environ[var]
    
    def _set_defaults(self):
        """Set default values for missing configuration"""
        defaults = {
            'FLASK_DEBUG': 'false',
            'FLASK_HOST': '127.0.0.1',
            'FLASK_PORT': '5000'
        }
        
        for key, default_value in defaults.items():
            if key not in self.config:
                self.config[key] = default_value
    
    def get_api_key(self, service: str = 'gemini') -> Optional[str]:
        """
        Get API key for specified service
        
        Args:
            service: 'gemini', 'openai', etc.
        
        Returns:
            API key string or None if not found
        """
        key_mappings = {
            'gemini': ['LANGEXTRACT_API_KEY', 'GEMINI_API_KEY'],
            'openai': ['OPENAI_API_KEY'],
            'langextract': ['LANGEXTRACT_API_KEY']
        }
        
        possible_keys = key_mappings.get(service.lower(), [])
        
        for key in possible_keys:
            if key in self.config and self.config[key]:
                return self.config[key]
        
        return None
    
    def get(self, key: str, default=None):
        """Get configuration value"""
        return self.config.get(key, default)
    
    def get_bool(self, key: str, default: bool = False) -> bool:
        """Get boolean configuration value"""
        value = self.config.get(key, str(default)).lower()
        return value in ('true', '1', 'yes', 'on')
    
    def get_int(self, key: str, default: int = 0) -> int:
        """Get integer configuration value"""
        try:
            return int(self.config.get(key, default))
        except (ValueError, TypeError):
            return default
    
    def validate_api_keys(self) -> dict:
        """
        Validate that required API keys are present
        
        Returns:
            Dictionary with validation results
        """
        results = {
            'gemini': bool(self.get_api_key('gemini')),
            'all_optional_configured': True
        }
        
        # Check if at least one AI service is configured
        ai_services = ['gemini', 'openai']
        configured_services = [svc for svc in ai_services if self.get_api_key(svc)]
        
        results['ai_services_available'] = len(configured_services) > 0
        results['configured_services'] = configured_services
        
        return results
    
    def get_flask_config(self) -> dict:
        """Get Flask-specific configuration"""
        return {
            'DEBUG': self.get_bool('FLASK_DEBUG'),
            'HOST': self.get('FLASK_HOST'),
            'PORT': self.get_int('FLASK_PORT', 5000)
        }
    
    def print_status(self):
        """Print configuration status (without exposing sensitive data)"""
        print("\nConfiguration Status:")
        print("-" * 40)
        
        # API Keys status
        validation = self.validate_api_keys()
        
        for service, available in validation.items():
            if service.endswith('_available') or service.startswith('configured'):
                continue
            status = "OK: Configured" if available else "MISSING" 
            print(f"{service.upper()} API Key: {status}")
        
        # Flask config
        flask_config = self.get_flask_config()
        print(f"\nFlask Configuration:")
        print(f"  Debug Mode: {flask_config['DEBUG']}")
        print(f"  Host: {flask_config['HOST']}")
        print(f"  Port: {flask_config['PORT']}")
        
        # AI Services
        if validation['configured_services']:
            print(f"\nAI Services Available: {', '.join(validation['configured_services'])}")
        else:
            print("\nWarning: No AI services configured - will use fallback analysis")


# Global configuration instance
config = SecureConfig()

# Convenience functions

def get_api_key(service: str = 'gemini') -> Optional[str]:
    """Get API key for service"""
    return config.get_api_key(service)

def get_config(key: str, default=None):
    """Get configuration value"""
    return config.get(key, default)

def is_api_configured(service: str = 'gemini') -> bool:
    """Check if API key is configured for service"""
    return bool(get_api_key(service))

def validate_setup() -> tuple[bool, str]:
    """Validate that the setup is ready for AI analysis"""
    validation = config.validate_api_keys()
    
    if validation['ai_services_available']:
        return True, "Configuration is ready for AI analysis"
    else:
        missing_keys = []
        if not validation['gemini']:
            missing_keys.append("Gemini API key")
        
        if missing_keys:
            return False, f"Missing: {', '.join(missing_keys)}"
        else:
            return False, "Configuration validation failed"

def get_domain_terms():
    """Convenience function to get domain terms from config"""
    return config.get_domain_terms()


if __name__ == "__main__":
    # Test configuration loading
    print("Testing Secure Configuration")
    
    # Print status
    config.print_status()
    
    # Test API key access
    gemini_key = get_api_key('gemini')
    if gemini_key:
        # Don't print the actual key, just confirm it's loaded
        masked_key = f"{gemini_key[:8]}...{gemini_key[-4:]}" if len(gemini_key) > 12 else "***"
        print(f"\nOK: Gemini API Key loaded: {masked_key}")
    else:
        print("\nERROR: Gemini API Key not found")
    
    # Test validation
    is_valid, message = validate_setup()
    if is_valid:
        print("\nSUCCESS: Configuration is ready for AI-enhanced analysis!")
    else:
        print(f"\nWARNING: {message}")
        print("AI features will be limited - consider adding API keys")
