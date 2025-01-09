---
title: "Essential CLI/TUI Tools for Developers"
description: "An opinionated list of CLI/TUI applications for developer productivity."
cover: images/kubectx.gif
---

As developers, we spend a lot of time in our terminal. Or maybe we could spend even more, because there are so many great CLI/TUI tools that can boost the developer productivity, or just be fun to use.

This article contains a categorized list of CLIs / TUIs I personally use and those widely adopted in the development community.

## Kubernetes

**[k9s](https://github.com/derailed/k9s)** - Kubernetes CLI To Manage Your Clusters In Style!

> K9s provides a terminal UI to interact with your Kubernetes clusters. The aim of this project is to make it easier to navigate, observe and manage your applications in the wild. K9s continually watches Kubernetes for changes and offers subsequent commands to interact with your observed resources.

![k9s](images/k9s.png)

**[ktop](https://github.com/vladimirvivien/ktop)** - A top-like tool for your Kubernetes clusters.

> Following the tradition of Unix/Linux top tools, ktop is a tool that displays useful metrics information about nodes, pods, and other workload resources running in a Kubernetes cluster.

![ktop](images/ktop.png)

**[kubectx](https://github.com/ahmetb/kubectx)** - switch between contexts (clusters) on kubectl faster.

> kubectx is a tool to switch between contexts (clusters) on kubectl faster.
>
> kubens is a tool to switch between Kubernetes namespaces (and configure them for kubectl) easily.

![ktop](images/kubectx.gif)

**[kdash](https://github.com/kdash-rs/kdash)** - A simple and fast dashboard for Kubernetes.

> A simple terminal dashboard for Kubernetes built with Rust

![kdash](images/kdash.png)


**[kubescape](https://github.com/kubescape/kubescape)** - Kubernetes security platform for your IDE, CI/CD pipelines, and clusters.

> Kubescape is an open-source Kubernetes security platform that provides comprehensive security coverage, from left to right across the entire development and deployment lifecycle. It offers hardening, posture management, and runtime security capabilities to ensure robust protection for Kubernetes environments. It saves Kubernetes users and admins precious time, effort, and resources.

![kubescape](images/kubescape.jpg)

## Containers

**[ctop](https://github.com/bcicen/ctop)** - A top-like interface for container metrics.

> ctop provides a concise and condensed overview of real-time metrics for multiple containers.
> 
> ctop comes with built-in support for Docker and runC; connectors for other container and cluster systems are planned for future releases.

![ctop](images/ctop.gif)

**[lazydocker](https://github.com/jesseduffield/lazydocker)** - A simple terminal UI for both docker and docker-compose.

> Memorising docker commands is hard. Memorising aliases is slightly less hard. Keeping track of your containers across multiple terminal windows is near impossible. What if you had all the information you needed in one terminal window with every common command living one keypress away (and the ability to add custom commands as well). Lazydocker's goal is to make that dream a reality.

![](images/lazydocker.gif)

**[dive](https://github.com/wagoodman/dive)** - A tool for exploring each layer in a docker image.

> A tool for exploring a docker image, layer contents, and discovering ways to shrink the size of your Docker/OCI image.

![](images/dive.gif)

## Files/Text

**[jq](https://github.com/jqlang/jq)** - Command-line JSON processor.

> jq is a lightweight and flexible command-line JSON processor akin to sed, awk, grep, and friends for JSON data. It's written in portable C and has zero runtime dependencies, allowing you to easily slice, filter, map, and transform structured data.

![](images/jq.jpg)

**[bat](https://github.com/sharkdp/bat)** - A cat(1) clone with wings.

> bat is an enhanced version of the cat command, written in Rust, integrating syntax highlighting, git integration, and automatic paging.
> 
> Its syntax highlighting supports numerous programming and markup languages, making code more readable directly in the terminal. Git integration allows users to see modifications in relation to the index, highlighting the added or changed lines.

![](images/bat.jpg)

**[ripgrep](https://github.com/BurntSushi/ripgrep)** - Recursively search directories for a regex pattern while respecting your gitignore.

> ripgrep is a line-oriented search tool that recursively searches the current directory for a regex pattern. By default, ripgrep will respect gitignore rules and automatically skip hidden files/directories and binary files. (To disable all automatic filtering by default, use rg -uuu.) ripgrep has first class support on Windows, macOS and Linux, with binary downloads available for every release. ripgrep is similar to other popular search tools like The Silver Searcher, ack and grep.

![](images/ripgrep.jpg)

**[rsync](https://github.com/RsyncProject/rsync)** - A fast and extraordinarily versatile file copying tool for both remote and local files.

> Rsync uses a delta-transfer algorithm which provides a very fast method for bringing remote files into sync. It does this by sending just the differences in the files across the link, without requiring that both sets of files are present at one of the ends of the link beforehand. At first glance this may seem impossible because the calculation of diffs between two files normally requires local access to both files.

![](images/rsync.jpg)

## Git

**[lazygit](https://github.com/jesseduffield/lazygit)** - Simple terminal UI for git commands.

> Lazygit is a simple terminal UI for git commands, with keybindings for most actions. It aims to make working with git from the terminal easier and more intuitive.

![](images/lazygit.jpg)

**[gitui](https://github.com/extrawurst/gitui)** - Blazing fast terminal-ui for git written in Rust.

> GitUI provides you with the user experience and comfort of a git GUI but right in your terminal while being portable, fast, free and opensource.

![](images/gitui.gif)

## Development

**[ATAC](https://github.com/Julien-cpsn/ATAC)** - A simple API client (postman like) in your terminal.

> ATAC is Arguably a Terminal API Client. It is based on well-known clients such as Postman, Insomnia, or even Bruno, but inside your terminal without any specific graphical environment needed.

![](images/atac.png)

**[vegeta](https://github.com/tsenart/vegeta)** - HTTP load testing tool and library.

> Vegeta is a versatile HTTP load testing tool built out of a need to drill HTTP services with a constant request rate.

![](images/vegeta.jpg)

**[k6](https://github.com/grafana/k6)** - A modern load testing tool, using Go and JavaScript.

> k6 is a modern load-testing tool, built on our years of experience in the performance and testing industries. It's built to be powerful, extensible, and full-featured. The key design goal is to provide the best developer experience.

![](images/k6.png)

**[httpie](https://github.com/httpie/cli)** - modern, user-friendly command-line HTTP client for the API era.

> HTTPie (pronounced aitch-tee-tee-pie) is a command-line HTTP client. Its goal is to make CLI interaction with web services as human-friendly as possible. HTTPie is designed for testing, debugging, and generally interacting with APIs & HTTP servers. The http & https commands allow for creating and sending arbitrary HTTP requests. They use simple and natural syntax and provide formatted and colorized output.

![](images/httpie.gif)

**[asciinema](https://github.com/asciinema/asciinema)** - Terminal session recorder.

> asciinema (aka asciinema CLI or asciinema recorder) is a command-line tool for recording terminal sessions.
> 
> Unlike typical screen recording software, which records visual output of a screen into a heavyweight video files (.mp4, .mov), asciinema recorder runs inside a terminal, capturing terminal session output into a lightweight recording files in the asciicast format (.cast).

![](images/asciinema.png)

## Networking

**[dog](https://github.com/ogham/dog)** - A command-line DNS client.

> dog is a command-line DNS client, like dig. It has colourful output, understands normal command-line argument syntax, supports the DNS-over-TLS and DNS-over-HTTPS protocols, and can emit JSON.

![](images/dog.png)

**[gping](https://github.com/orf/gping)** - Ping, but with a graph.

> gping is an excellent tool for network, system, devops engineers and for anyone looking to visualize their ping output. It's best utilized in environments where readability and visual communication of ping results is essential.

![](images/gping.gif)

## Workstation

**[btop](https://github.com/aristocratos/btop)** - A monitor of resources.

> Resource monitor that shows usage and stats for processor, memory, disks, network and processes.

![](images/btop.jpg)

**[chezmoi](https://github.com/twpayne/chezmoi)** - Manage your dotfiles across multiple diverse machines, securely.

> chezmoi helps you manage your personal configuration files (dotfiles, like ~/.gitconfig) across multiple machines.
> 
> chezmoi provides many features beyond symlinking or using a bare git repo.

    chezmoi init
    chezmoi add ~/.bashrc
    chezmoi edit ~/.bashrc
    chezmoi diff
    chezmoi -v apply

## Conclusion

These CLIs/TUIs should work well in any modern terminal, I personally use [Ghostty](https://ghostty.org/) currently and it works great.

There's a huge amount of CLIs/TUIs out there, and i can't list them all (though i tried).








