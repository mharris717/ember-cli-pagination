require 'mharris_ext'

class Entry
  include FromHash
  attr_accessor :path

  fattr(:dash_name) do
    File.basename(path).split(".").first
  end

  fattr(:body) do
    File.read(path)
  end

  fattr(:heading) do
    line = body.split("\n").first.strip
    raise line unless line =~ /^## (.+)$/
    $1
  end

  fattr(:anchor) do
    heading.gsub("`","").gsub(" ","-").downcase
  end

  def link
    "[#{heading}](##{anchor})"
  end

  def to_s
    body
  end

  class << self
    def get(base_path)
      root = File.expand_path(File.dirname(__FILE__)+"/..")
      dir = "#{root}/doc/#{base_path}"
      Dir["#{dir}/*.md"].map { |x| new(path: x) }.select { |x| x.body.present? }
    end
    fattr(:primitives) do
      get(:primitives)
    end

    fattr(:scenarios) do
      sort_order = ["local-store","remote-paginated-api","remote-unpaginated-api","paginating-a-filtered-list"]
      get(:scenarios).sort_by { |x| sort_order.index(x.dash_name) || (raise "nothing for #{x.dash_name}") }
    end

    fattr(:others) do
      get(:other)
    end
  end
end

class TableOfContents
  include FromHash
  fattr(:primitives) { Entry.primitives }
  fattr(:scenarios) { Entry.scenarios }
  fattr(:others) { Entry.others }

  def to_s
    prim = primitives.map { |x| "* #{x.link}" }.join("\n")
    scen = scenarios.map { |x| "* #{x.link}" }.join("\n")
    other = others.map { |x| "* #{x.link}" }.join("\n")

    res = []
    res << "# Usage"
    res << '#### Scenarios'
    res << scen
    res << '#### Primitives'
    res << prim
    res << '#### Other'
    res << other
    
    res.join("\n\n")
  end
end

class Body
  include FromHash
  fattr(:primitives) { Entry.primitives }
  fattr(:scenarios) { Entry.scenarios }
  fattr(:others) { Entry.others }

  def to_s
    rule = "\n\n--------------\n\n"

    res = []
    res << "# Scenarios"
    res << scenarios.join(rule)
    res << "# Primitives"
    res << primitives.join(rule)
    res << "# Other"
    res << others.join(rule)

    res.join("\n\n")
  end
end

class Full
  include FromHash
  fattr(:body) { Body.new }
  fattr(:toc) { TableOfContents.new }

  def to_s
    "#{toc}\n\n#{body}"
  end
end

full = Full.new
File.create("doc/full.md",full.to_s)