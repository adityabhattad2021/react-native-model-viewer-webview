# Security Policy

## Supported Versions

Security fixes are applied to the latest published minor version. Before `1.0.0`,
only the latest published version is supported.

## Reporting A Vulnerability

Do not open public issues for vulnerabilities.

Report privately through the repository owner's preferred security channel. If
GitHub private vulnerability reporting is enabled, use that. Otherwise, contact
the maintainer directly and include:

- package version
- affected platform and React Native version
- reproduction steps
- impact
- whether the issue requires a malicious model file, malicious model URL, or
  malicious app input

## Security Considerations

This package generates HTML and runs it inside `react-native-webview`.

- Treat untrusted model URLs as remote content.
- Prefer trusted domains or bundled assets for production apps.
- Avoid passing untrusted strings through `additionalAttributes`.
- Use offline script loading for apps that cannot rely on CDN availability.
- Keep `react-native-webview` updated in consuming apps.
