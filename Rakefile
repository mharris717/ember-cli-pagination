require 'mharris_ext'
require 'github/markup'
require 'redcarpet'

class BuildJs
  def build_one(relative_path)
    ec "coffee -c -b #{relative_path}"
  end

  def build_old
    %w(route-mixin controller-mixin test-helpers).each do |f|
      build_one "addon/#{f}.coffee"
    end
  end

  def build(name)
    ec "coffee -b -c -o #{name} #{name}-coffee"
    #ec "coffee -b -c -o app app-coffee"
  end
end

namespace :build_js do
  task :app do
    BuildJs.new.build(:app)
  end

  task :addon do
    BuildJs.new.build(:addon)
  end

  task :loop do
    loop do
      BuildJs.new.build
      sleep 1
    end
  end
end

task :readme do
  loop do
    
    res = GitHub::Markup.render('README.md', File.read("README.md"))
    File.create "README.html",res
    sleep 0.5
  end
end

TEST_FILES = ["tests/dummy/app/adapters/application", "tests/dummy/app/controllers/todos", "tests/dummy/app/models/todo", "tests/dummy/app/routes/todos", "tests/helpers/pretender-server", "tests/integration/index-test", "tests/integration/pagination-test"]

task :copy_coffee_tests do
  root = File.dirname(__FILE__)
  target_short = "tests_tmp"
  %w(js hbs json html xml txt css).each do |ext|
    Dir["#{root}/tests-coffee/**/*.#{ext}"].each do |file|
      dir = File.dirname(file)
      base = File.basename(file)

      target_dir = dir.gsub("tests-coffee",target_short)
      puts target_dir
      ec "mkdir -p #{target_dir}"
      FileUtils.cp file,"#{target_dir}/#{base}"
    end
  end

  %w(.jshintrc .gitkeep).each do |ext|
    Dir["#{root}/tests-coffee/**/#{ext}"].each do |file|
      dir = File.dirname(file)
      base = File.basename(file)

      target_dir = dir.gsub("tests-coffee",target_short)
      puts target_dir
      ec "mkdir -p #{target_dir}"
      FileUtils.cp file,"#{target_dir}/#{base}"
    end
  end

  ec "coffee --no-header -b -c -o #{target_short} tests-coffee"
  if FileTest.exist?("#{root}/tests")
    FileUtils.rm_r("#{root}/tests")
  end
  ec "mv tests_tmp tests"
end

task :build_tests do
  #ec "coffee --no-header -b -c -o tests tests"
  TEST_FILES.each_with_index do |f,i|
    if i <= 9999
      if FileTest.exist?("#{f}.coffee")
        ec "coffee --no-header -b -c #{f}.coffee"
        FileUtils.rm "#{f}.coffee"
      end
    else
      if FileTest.exist?("#{f}.js")
        ec "rm #{f}.js"
      end
    end
  end
end

task :print_coffee do
  root = File.dirname(__FILE__)
  res = []
  Dir["tests/**/*.coffee"].map do |f|
    f.gsub(".coffee","")
  end.each { |x| res << x }
  puts res.inspect
end

task :links do
  root = File.expand_path(File.dirname(__FILE__))
  %w(app tests addon).each do |name|
    ec "ln -s #{root}/#{name}-coffee #{root}/coffee_stuff/#{name}-coffee"
  end
end

task :guard do
  root = File.expand_path(File.dirname(__FILE__))
  dirs = %w(tests).map do |name|
    "--watchdir #{root}/#{name}-coffee"
  end.reverse.join(" ")
  puts "guard #{dirs}"
  exec "guard #{dirs}"
end

task "link_tests" do
  root = File.expand_path(File.dirname(__FILE__))
  ec "ln -s #{root}/tests-coffee #{root}/tests"
end

